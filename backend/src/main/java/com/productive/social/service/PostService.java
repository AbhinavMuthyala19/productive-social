package com.productive.social.service;

import com.productive.social.dao.PostDAO;
import com.productive.social.dto.posts.PostCreateRequest;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.entity.*;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.exceptions.posts.PostCreationException;
import com.productive.social.exceptions.posts.PostImageUploadException;
import com.productive.social.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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

    // -------------------------
    // CREATE POST
    // -------------------------
    public PostResponse createPost(PostCreateRequest request, List<MultipartFile> images) {
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
                } catch (Exception e) {
                	log.error("Failed to upload images for postId={}", post.getId(), e);
                    throw new PostImageUploadException("Failed to upload images");
                }
            }

            log.info("Post created successfully. userId={}, postId={}", user.getId(), post.getId());
            return postDAO.getUserPosts(user.getId(), user, 0, 1).get(0);
        }
        catch (CommunityNotFoundException | PostImageUploadException e) {
            throw e; // handled by GlobalExceptionHandler
        }
        catch (Exception e) {
        	log.error("Unexpected error while creating post for user", e);
            throw new PostCreationException("Failed to create post");
        }
    }


    private void savePostImages(Post post, List<MultipartFile> images) throws IOException {
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                String savedPath = imageStorageService.store(file);

                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl(savedPath)
                        .build();

                postImageRepository.save(postImage);
            }
        }
    }

    // -------------------------
    // FEEDS
    // -------------------------
    public List<PostResponse> getGlobalFeed(int page, int pageSize) {
        User user = authService.getCurrentUser();
        return postDAO.getGlobalFeed(user, page, pageSize);
    }

    public List<PostResponse> getCommunityFeed(Long communityId, int page, int pageSize) {
        User user = authService.getCurrentUser();
        return postDAO.getCommunityFeed(communityId, user, page, pageSize);
    }

    public List<PostResponse> getUserPosts(int page, int pageSize) {
        User user = authService.getCurrentUser();
        return postDAO.getUserPosts(user.getId(), user, page, pageSize);
    }

    // -------------------------
    // LIKE / UNLIKE
    // -------------------------
    public void likePost(Long postId) {
        User user = authService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        if (!postLikeRepository.existsByPostAndUser(post, user)) {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();

            postLikeRepository.save(like);
            log.info("Post liked. userId={}, postId={}", user.getId(), postId);
        }
    }

    @Transactional
    public void unlikePost(Long postId) {
        User user = authService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        postLikeRepository.deleteByPostAndUser(post, user);
        log.info("Post unliked. userId={}, postId={}", user.getId(), postId);
    }
}
