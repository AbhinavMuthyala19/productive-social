package com.productive.social.service;

import com.productive.social.dao.PostDAO;
import com.productive.social.dto.posts.PostCreateRequest;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.entity.*;
import com.productive.social.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
    public PostResponse createPost(PostCreateRequest request, List<MultipartFile> images)
 throws Exception {

        User user = authService.getCurrentUser();

        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new RuntimeException("Community not found"));

        // 1. Save post
        Post post = Post.builder()
                .user(user)
                .community(community)
                .content(request.getContent())
                .noteAttachmentId(request.getNoteAttachmentId()) // for later
                .build();

        post = postRepository.save(post);

        // 2. Save images
        if (images != null && !images.isEmpty()) {
            savePostImages(post, images);
        }

        // 3. Return PostResponse using DAO aggregations
        return postDAO.getUserPosts(user.getId(), user, 0, 1).get(0);
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


    private String saveImageToLocalStorage(MultipartFile file) throws Exception {

        if (file.isEmpty()) return null;

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = "uploads/images/" + fileName;

        java.nio.file.Path destination = java.nio.file.Paths.get(filePath);
        java.nio.file.Files.createDirectories(destination.getParent());
        java.nio.file.Files.write(destination, file.getBytes());

        return "/" + filePath;
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
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!postLikeRepository.existsByPostAndUser(post, user)) {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(like);
        }
    }

    @Transactional
    public void unlikePost(Long postId) {
        User user = authService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        postLikeRepository.deleteByPostAndUser(post, user);
    }
}
