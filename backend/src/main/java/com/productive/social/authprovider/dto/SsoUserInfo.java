package com.productive.social.authprovider.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SsoUserInfo {

    private String providerUserId;

    private String email;

    private String name;

    private String picture;

}