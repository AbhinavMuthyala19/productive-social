package com.productive.social.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

    private Long userId;
    private String otp;
}