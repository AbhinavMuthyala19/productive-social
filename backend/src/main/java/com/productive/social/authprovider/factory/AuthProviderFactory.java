package com.productive.social.authprovider.factory;

import com.productive.social.authprovider.provider.AuthProviderVerifier;
import com.productive.social.authprovider.provider.GoogleAuthProviderVerifier;
import com.productive.social.enums.AuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthProviderFactory {

    private final GoogleAuthProviderVerifier googleVerifier;

    public AuthProviderVerifier getVerifier(AuthProvider provider) {

        switch (provider) {

            case GOOGLE:
                return googleVerifier;

            default:
                throw new IllegalArgumentException(
                        "Unsupported auth provider: " + provider
                );
        }
    }
}