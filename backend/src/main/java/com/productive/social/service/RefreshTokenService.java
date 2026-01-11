package com.productive.social.service;

import com.productive.social.entity.RefreshToken;
import com.productive.social.entity.User;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.UnauthorizedException;
import com.productive.social.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(User user) {
        try {
            RefreshToken token = RefreshToken.builder()
                    .user(user)
                    .token(UUID.randomUUID().toString()) // raw token
                    .expiryDate(Instant.now().plusMillis(1000L * 60 * 60 * 24 * 7)) // 7 days
                    .build();

            return refreshTokenRepository.save(token);
        }
        catch (Exception e) {
            throw new InternalServerException("Failed to create refresh token");
        }
    }

    public RefreshToken validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiryDate().isAfter(Instant.now()))
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));
    }

    @Transactional
    public void deleteToken(String token) {
        try {
            refreshTokenRepository.deleteByToken(token);
        }
        catch (Exception e) {
            throw new InternalServerException("Failed to delete refresh token");
        }
    }

    @Transactional
    public void deleteAllUserTokens(Long userId) {
        try {
            refreshTokenRepository.deleteAllByUserId(userId);
        }
        catch (Exception e) {
            throw new InternalServerException("Failed to delete user tokens");
        }
    }
}
