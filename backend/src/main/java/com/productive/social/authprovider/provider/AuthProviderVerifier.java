package com.productive.social.authprovider.provider;

import com.productive.social.authprovider.dto.SsoUserInfo;

public interface AuthProviderVerifier {

    SsoUserInfo verify(String token);

}