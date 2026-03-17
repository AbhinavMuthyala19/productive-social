package com.productive.social.authprovider.service;

import com.productive.social.authprovider.dto.SsoLoginRequest;
import com.productive.social.authprovider.dto.SsoUserInfo;
import com.productive.social.authprovider.factory.AuthProviderFactory;
import com.productive.social.authprovider.provider.AuthProviderVerifier;
import com.productive.social.dto.auth.AuthResponse;
import com.productive.social.entity.RefreshToken;
import com.productive.social.entity.User;
import com.productive.social.entity.UserAuthProvider;
import com.productive.social.enums.AuthProvider;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.repository.UserAuthProviderRepository;
import com.productive.social.repository.UserRepository;
import com.productive.social.service.RefreshTokenService;
import com.productive.social.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthProviderService {

    private final AuthProviderFactory authProviderFactory;
    private final UserAuthProviderRepository userAuthProviderRepository;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    public AuthResponse authenticate(SsoLoginRequest request) {

        AuthProvider provider = request.getAuthProvider();

        AuthProviderVerifier verifier =
                authProviderFactory.getVerifier(provider);

        // 1️⃣ Verify token with provider
        SsoUserInfo userInfo = verifier.verify(request.getToken());

        // 2️⃣ Check provider identity
        var providerIdentity =
                userAuthProviderRepository
                        .findByAuthProviderAndAuthProviderId(
                                provider,
                                userInfo.getProviderUserId()
                        );

        User user;

        if (providerIdentity.isPresent()) {

            user = providerIdentity.get().getUser();

            log.info("SSO login success. provider={}, userId={}",
                    provider, user.getId());

        } else {

            // 3️⃣ Check if email already exists
            user = userRepository
                    .findByEmail(userInfo.getEmail())
                    .orElse(null);

            if (user != null) {

                log.info("Linking {} provider to existing userId={}",
                        provider, user.getId());

            } else {

                user = createUserFromSso(userInfo);

                log.info("Created new SSO user userId={}", user.getId());
            }

            // 4️⃣ Create provider identity
            UserAuthProvider identity =
                    UserAuthProvider.builder()
                            .user(user)
                            .authProvider(provider)
                            .authProviderId(userInfo.getProviderUserId())
                            .createdAt(LocalDateTime.now())
                            .build();

            userAuthProviderRepository.save(identity);
        }

        // 5️⃣ Generate tokens (same flow as normal login)
        String accessToken =
                jwtUtil.generateToken(String.valueOf(user.getId()));

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken()
        );
    }


    private User createUserFromSso(SsoUserInfo userInfo) {

        String username = generateUniqueUsername(userInfo.getEmail());

        User user = User.builder()
                .email(userInfo.getEmail())
                .username(username)
                .name(userInfo.getName())
                .profilePicture(userInfo.getPicture())
                .emailVerified(true)
                .timezone("UTC")
                .password(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }


    private String generateUniqueUsername(String email) {

        String baseUsername =
                email.split("@")[0]
                        .replaceAll("[^a-zA-Z0-9]", "_")
                        .toLowerCase();

        String username = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {

            username = baseUsername + "_" + counter;
            counter++;
        }

        return username;
    }
}