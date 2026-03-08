package com.productive.social.dto.auth;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String token;
    private String newPassword;
}
