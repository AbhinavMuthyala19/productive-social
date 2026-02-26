package com.productive.social.dto.profile;

import lombok.*;

@Getter
@Setter
public class UserProfileUpdateRequest {
    private String username;
    private String name;
    private String bio;
    private String email;
}
