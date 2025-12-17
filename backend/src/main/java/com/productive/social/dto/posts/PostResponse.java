package com.productive.social.dto.posts;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
public class PostResponse {

    private Long postId;

    private PostUserDTO user;
    private PostCommunityDTO community;

    private String content;
    private List<PostImageDTO> images;

    private long likesCount;
    private long commentsCount;

    private boolean likedByCurrentUser;

    private Timestamp createdAt;
}