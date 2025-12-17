package com.productive.social.service;

import com.productive.social.dto.comments.CommentCreateRequest;
import com.productive.social.dto.comments.CommentResponse;
import com.productive.social.entity.*;
import com.productive.social.repository.CommentRepository;
import com.productive.social.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthService authService;

    // -------------------------
    // ADD COMMENT
    // -------------------------
    public CommentResponse addComment(CommentCreateRequest request) {

        User user = authService.getCurrentUser();

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.getContent())
                .parentComment(parent)
                .build();

        comment = commentRepository.save(comment);

        return convertToResponse(comment);
    }

    // -------------------------
    // GET COMMENTS FOR POST
    // -------------------------
    public List<CommentResponse> getCommentsForPost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> comments = commentRepository
                .findByPostAndParentCommentIsNullOrderByCreatedAtAsc(post);

        return comments.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // -------------------------
    // DTO BUILDER
    // -------------------------
    private CommentResponse convertToResponse(Comment comment) {

        List<CommentResponse> replies = commentRepository
                .findByParentCommentOrderByCreatedAtAsc(comment)
                .stream()
                .map(this::convertToResponse)
                .toList();

        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .profilePicture(comment.getUser().getProfilePicture())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .replies(replies)
                .build();
    }
}
