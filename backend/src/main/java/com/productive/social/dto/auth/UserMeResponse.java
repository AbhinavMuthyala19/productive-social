package com.productive.social.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UserMeResponse {

    private Long id;
    private String username;
    private String email;
    private String profilePicture;
    private String bio;

    private Long joinedCommunitiesCount;

    private LocalDateTime  createdAt;
}

