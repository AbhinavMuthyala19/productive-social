package com.productive.social.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String username;
    private String name;
    private String email;

    private String profilePicture;
    private String bio;

    private LocalDateTime joinedAt;

    private UserProfileStatsResponse stats;
}
