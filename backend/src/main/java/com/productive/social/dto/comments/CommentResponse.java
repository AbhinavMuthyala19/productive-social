package com.productive.social.dto.comments;


import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
public class CommentResponse {

    private Long id;

    private Long userId;
    private String username;
    private String profilePicture;

    private String content;
    private Timestamp createdAt;

    private List<CommentResponse> replies; // nested comments
}

