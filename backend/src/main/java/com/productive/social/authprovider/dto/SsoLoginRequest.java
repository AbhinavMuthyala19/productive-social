package com.productive.social.authprovider.dto;

import com.productive.social.enums.AuthProvider;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SsoLoginRequest {

    private AuthProvider authProvider;

    private String token;

}