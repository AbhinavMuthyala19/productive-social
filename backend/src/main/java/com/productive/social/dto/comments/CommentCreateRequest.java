package com.productive.social.dto.comments;

import lombok.Data;

@Data
public class CommentCreateRequest {

    private Long postId;
    private String content;

    private Long parentCommentId; // null for top-level comments
}