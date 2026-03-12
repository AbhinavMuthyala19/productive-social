package com.productive.social.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.productive.social.dao.PostDAO;
import com.productive.social.dao.StreakDAO;
import com.productive.social.dto.posts.PostCreateRequest;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.entity.Community;
import com.productive.social.entity.Notes;
import com.productive.social.entity.Post;
import com.productive.social.entity.PostImage;
import com.productive.social.entity.PostLike;
import com.productive.social.entity.Task;
import com.productive.social.entity.User;
import com.productive.social.entity.UserCommunity;
import com.productive.social.enums.ActivityType;
import com.productive.social.enums.MembershipStatus;
import com.productive.social.enums.UploadType;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.exceptions.files.FileSizeExceededException;
import com.productive.social.exceptions.files.InvalidFileException;
import com.productive.social.exceptions.notes.NotesLinkingException;
import com.productive.social.exceptions.posts.PostCreationException;
import com.productive.social.exceptions.posts.PostImageUploadException;
import com.productive.social.exceptions.tasks.TaskNotFoundException;
import com.productive.social.repository.CommentRepository;
import com.productive.social.repository.CommunityRepository;
import com.productive.social.repository.PostImageRepository;
import com.productive.social.repository.PostLikeRepository;
import com.productive.social.repository.PostRepository;
import com.productive.social.repository.TaskRepository;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommunityRepository communityRepository;
    private final AuthService authService;
    private final PostDAO postDAO;
    private final ImageStorageService imageStorageService;
    private final StreakService streakService;
    private final StreakDAO streakDAO;
    private final UserCommunityRepository userCommunityRepository;
    private final UserRepository userRepository;
    private final NotesService notesService;
    private final PostNotesService postNotesService;
    private final TaskNotesService taskNotesService;
    private final TaskRepository taskRepository;
    private final FileValidationService fileValidationService;
    private final CommentRepository commentRepository;

    // -------------------------
    // CREATE POST
    // -------------------------
    @Transactional
    public PostResponse createPost(PostCreateRequest request, List<MultipartFile> images, List<MultipartFile> notesFiles) {
        try {
            User user = authService.getCurrentUser();

            Community community = communityRepository.findById(request.getCommunityId())
                    .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

            Post post = Post.builder()
                    .user(user)
                    .community(community)
                    .title(request.getTitle())
                    .content(request.getContent())
                    .build();

            post = postRepository.save(post);

            if (images != null && !images.isEmpty()) {
                try {
                    savePostImages(post, images);
                } catch (InvalidFileException | FileSizeExceededException e) {
                    log.warn("Post image validation failed. postId={}, error={}", post.getId(), e.getMessage());
                    throw e;
                } catch (PostImageUploadException e) {
                    log.error("Failed to upload images for postId={}", post.getId(), e);
                    throw e;
                }
            }
            
         // Validate Task if provided
            Task task = null;

            if (request.getTaskId() != null) {
                task = taskRepository.findById(request.getTaskId())
                        .orElseThrow(() ->
                                new TaskNotFoundException("Task not found with id: " + request.getTaskId())
                        );
            }
            
         // -------------------------
         // SAVE NOTES (Optional)
         // -------------------------
         if (notesFiles != null && !notesFiles.isEmpty()) {

             for (MultipartFile file : notesFiles) {

                 try {
                     Notes savedNotes = notesService.uploadNotesFromPost(file);

                     // Link to Post
                     postNotesService.linkNotesToPost(
                             post.getId(),
                             savedNotes.getId()
                     );

                     // Link to Task (only if validated above)
                     if (task != null) {
                         taskNotesService.linkNotesToTask(
                                 task.getId(),
                                 savedNotes.getId()
                         );
                     }

                 } catch (Exception e) {
                     log.error("Failed to upload/link notes for postId={}", post.getId(), e);
                     throw new NotesLinkingException("Failed to upload notes");
                 }
             }
         }
            
         // -------------------------
         // STREAK ACTIVITY
         // -------------------------
         streakService.recordActivity(
                 user,
                 community,
                 ActivityType.POST
         );

            log.info("Post created successfully. userId={}, postId={}", user.getId(), post.getId());
            Integer streak = streakDAO.getStreakForCurrentUserInCommunity(user.getId(), post.getCommunity().getId());
            PostResponse currentPost =  postDAO.getCurrentPost(post.getId(),post.getCommunity().getId(),user.getId(), user, 0, 1).get(0);
            currentPost.getCommunity().setStreak(streak);
            return currentPost;
        }
        catch (CommunityNotFoundException | PostImageUploadException e) {
            throw e; // handled by GlobalExceptionHandler
        }
        catch (Exception e) {
        	log.error("Unexpected error while creating post for user", e);
            throw new PostCreationException("Failed to create post");
        }
    }


    @Transactional
    private void savePostImages(Post post, List<MultipartFile> images) {

        for (MultipartFile file : images) {

            if (file == null || file.isEmpty()) {
                continue;
            }

            try {
                // 1️⃣ Validate image (10MB limit example)
                fileValidationService.validateImage(file, 10);

                // 2️⃣ Store file
                String savedPath = imageStorageService.store(file,UploadType.POST_IMAGE);

                // 3️⃣ Save DB record
                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl(savedPath)
                        .build();

                postImageRepository.save(postImage);

            } catch (InvalidFileException | FileSizeExceededException e) {
                throw e;

            } catch (Exception e) {
                log.error("Image storage failed for postId={}", post.getId(), e);
                throw new PostImageUploadException("Failed to store post image");
            }
        }
    }

    // -------------------------
    // FEEDS
    // -------------------------
    public List<PostResponse> getGlobalFeed(int page, int pageSize) {

        User currentUser = authService.getCurrentUser();

        // 1️⃣ Get feed from DAO (streak = 0)
        List<PostResponse> feed =
                postDAO.getGlobalFeed(currentUser, page, pageSize);

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect all (authorId, communityId) pairs
        Set<Long> userIds = new HashSet<>();
        Set<Long> communityIds = new HashSet<>();

        for (PostResponse post : feed) {
            userIds.add(post.getUser().getId());
            communityIds.add(post.getCommunity().getId());
        }

        // 3️⃣ Load all memberships in ONE query
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdInAndCommunityIdInAndStatus(
                                userIds,
                                communityIds,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup map:
        // (userId + communityId) → UserCommunity
        Map<String, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getUser().getId() + "_" +
                                      uc.getCommunity().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak per post
        for (PostResponse post : feed) {

            Long authorId = post.getUser().getId();
            Long communityId = post.getCommunity().getId();

            String key = authorId + "_" + communityId;

            UserCommunity membership = membershipMap.get(key);

            int streak = 0;

            if (membership != null) {
                streak = streakService.calculateEffectiveStreak(membership);
            }

            // post.getUser().setStreak(streak);
            post.getCommunity().setStreak(streak);
        }

        return feed;
    }



    public List<PostResponse> getCommunityFeed(
            Long communityId,
            int page,
            int pageSize
    ) {

        User currentUser = authService.getCurrentUser();

        // 1️⃣ Fetch feed from DAO (streak = 0)
        List<PostResponse> feed =
                postDAO.getCommunityFeed(
                        communityId,
                        currentUser,
                        page,
                        pageSize
                );

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect all authorIds
        Set<Long> authorIds = feed.stream()
                .map(p -> p.getUser().getId())
                .collect(Collectors.toSet());

        // 3️⃣ Fetch memberships for this community only
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdInAndCommunityIdAndStatus(
                                authorIds,
                                communityId,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup map
        Map<Long, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getUser().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak into each post
        for (PostResponse post : feed) {

            UserCommunity membership =
                    membershipMap.get(post.getUser().getId());

            int streak = 0;

            if (membership != null) {
                streak =
                        streakService.calculateEffectiveStreak(membership);
            }

//            post.getUser().setStreak(streak);
            post.getCommunity().setStreak(streak);
        }

        return feed;
    }



 // =====================================================
    // /feed/me
    // =====================================================
    public List<PostResponse> getMyPosts(int page, int pageSize) {

        User currentUser = authService.getCurrentUser();

        return buildUserFeed(
                currentUser.getId(),   // posts owner
                currentUser,           // viewer
                page,
                pageSize
        );
    }

    // =====================================================
    // /feed/{username}
    // =====================================================
    public List<PostResponse> getPostsByUsername(
            String userName,
            int page,
            int pageSize
    ) {

        User postOwner =
                userRepository.findByUsername(userName)
                        .orElseThrow(() ->
                                new NotFoundException("User not found")
                        );

        User viewer = authService.getCurrentUser();

        return buildUserFeed(
                postOwner.getId(),     // posts owner
                viewer,                // viewer
                page,
                pageSize
        );
    }

    // =====================================================
    // 🔥 CORE GENERIC LOGIC
    // =====================================================
    private List<PostResponse> buildUserFeed(
            Long postOwnerId,
            User viewer,
            int page,
            int pageSize
    ) {

        // 1️⃣ Fetch posts (DAO unchanged)
        List<PostResponse> feed =
                postDAO.getUserPosts(
                        postOwnerId,
                        viewer,
                        page,
                        pageSize
                );

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect communityIds
        Set<Long> communityIds =
                feed.stream()
                        .map(p -> p.getCommunity().getId())
                        .collect(Collectors.toSet());

        // 3️⃣ Load memberships FOR VIEWER
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdAndCommunityIdInAndStatus(
                                viewer.getId(),
                                communityIds,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup
        Map<Long, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getCommunity().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak (viewer streak)
        for (PostResponse post : feed) {

            UserCommunity membership =
                    membershipMap.get(
                            post.getCommunity().getId()
                    );

            int streak = 0;

            if (membership != null) {
                streak =
                        streakService
                                .calculateEffectiveStreak(membership);
            }

//            post.getUser().setStreak(streak);
            post.getCommunity().setStreak(streak);
        }

        return feed;
    }


    // -------------------------
    // LIKE / UNLIKE
    // -------------------------
    @Transactional
    public void likePost(Long postId) {

        try {

            User user = authService.getCurrentUser();

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> {
                        log.warn("Like post failed - post not found. postId={}", postId);
                        return new NotFoundException("Post not found");
                    });

            if (!postLikeRepository.existsByPostAndUser(post, user)) {

                PostLike like = PostLike.builder()
                        .post(post)
                        .user(user)
                        .build();

                postLikeRepository.save(like);

                log.info("Post liked successfully. userId={}, postId={}", user.getId(), postId);
            }

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while liking post. postId={}", postId, e);
            throw new InternalServerException("Failed to like post");
        }
    }


    @Transactional
    public void unlikePost(Long postId) {

        try {

            User user = authService.getCurrentUser();

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> {
                        log.warn("Unlike post failed - post not found. postId={}", postId);
                        return new NotFoundException("Post not found");
                    });

            postLikeRepository.deleteByPostAndUser(post, user);

            log.info("Post unliked successfully. userId={}, postId={}", user.getId(), postId);

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while unliking post. postId={}", postId, e);
            throw new InternalServerException("Failed to unlike post");
        }
    }
    
    @Transactional
    public void deletePost(Long postId) {

        try {

            User user = authService.getCurrentUser();

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> {
                        log.warn("Delete failed - post not found. postId={}", postId);
                        return new NotFoundException("Post not found");
                    });

            if (!post.getUser().getId().equals(user.getId())) {

                log.warn("Delete denied - user not owner. userId={}, postId={}",
                        user.getId(), postId);

                throw new BadRequestException("You cannot delete this post");
            }

            log.debug("Deleting post resources. postId={}", postId);

            // DELETE IMAGES
            List<PostImage> images = postImageRepository.findByPost(post);

            for (PostImage image : images) {

                imageStorageService.delete(image.getImageUrl());

            }

            postImageRepository.deleteAll(images);

            // DELETE LIKES
            postLikeRepository.deleteByPost(post);

            // DELETE COMMENTS
            commentRepository.deleteByPost(post);

            // DELETE POST-NOTES LINKS
            postNotesService.deleteLinksByPost(postId);

            // DELETE POST
            postRepository.delete(post);

            log.info("Post deleted successfully. userId={}, postId={}",
                    user.getId(), postId);

        }
        catch (NotFoundException | BadRequestException e) {
            throw e;
        }
        catch (Exception e) {

            log.error("Unexpected error while deleting post. postId={}", postId, e);

            throw new InternalServerException("Failed to delete post");
        }
    }
}
