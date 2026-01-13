package com.productive.social.service;

import com.productive.social.dto.comments.CommentCreateRequest;
import com.productive.social.dto.comments.CommentResponse;
import com.productive.social.entity.*;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.repository.CommentRepository;
import com.productive.social.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
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
        try {
            User user = authService.getCurrentUser();

            Post post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new NotFoundException("Post not found"));

            Comment parent = null;
            if (request.getParentCommentId() != null) {
                parent = commentRepository.findById(request.getParentCommentId())
                        .orElseThrow(() -> new NotFoundException("Parent comment not found"));
            }

            Comment comment = Comment.builder()
                    .post(post)
                    .user(user)
                    .content(request.getContent())
                    .parentComment(parent)
                    .build();

            comment = commentRepository.save(comment);
            
            log.info("Comment added. userId={}, postId={}, commentId={}",
                    user.getId(), post.getId(), comment.getId());

            return convertToResponse(comment);
        }
        catch (NotFoundException e) {
            throw e; // handled globally
        }
        catch (Exception e) {
        	log.error("Unexpected failure adding comment. postId={}, userId={}",
                    request.getPostId(),
                    authService.getCurrentUser().getId(), // safe call; request passed auth
                    e);
            // unexpected persistence or database error
            throw new InternalServerException("Failed to add comment");
        }
    }

    // -------------------------
    // GET COMMENTS FOR POST
    // -------------------------
    public List<CommentResponse> getCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        List<Comment> comments =
                commentRepository.findByPostAndParentCommentIsNullOrderByCreatedAtAsc(post);

        log.info("Fetching comments. postId={}, total={}", postId, comments.size());
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
