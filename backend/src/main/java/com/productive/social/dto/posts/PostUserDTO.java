package com.productive.social.dto.posts;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostUserDTO {

    private Long id;
    private String username;
    private String name;
    private String profilePicture;

    // For later streak integration
    private Integer streak;
}

