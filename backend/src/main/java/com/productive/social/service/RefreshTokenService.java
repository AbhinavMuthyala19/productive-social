package com.productive.social.service;

import com.productive.social.entity.RefreshToken;
import com.productive.social.entity.User;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.UnauthorizedException;
import com.productive.social.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
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

            RefreshToken saved = refreshTokenRepository.save(token);
            log.info("Created refresh token for userId={}", user.getId());
            return saved;
        }
        catch (Exception e) {
        	log.error("Failed to create refresh token for userId={}", user.getId(), e);
            throw new InternalServerException("Failed to create refresh token");
        }
    }

    public RefreshToken validateRefreshToken(String token) {
    	RefreshToken refreshToken =
         refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiryDate().isAfter(Instant.now()))
                .orElseThrow(() -> {
                    log.warn("Invalid or expired refresh token attempted: {}", token);
                    return new UnauthorizedException("Invalid or expired refresh token");
                });
    	return refreshToken;
    }

    @Transactional
    public void deleteToken(String token) {
        try {
            refreshTokenRepository.deleteByToken(token);
            log.info("Deleted refresh token {}", token);
        }
        catch (Exception e) {
        	log.error("Failed to delete refresh token {}", token, e);
            throw new InternalServerException("Failed to delete refresh token");
        }
    }

    @Transactional
    public void deleteAllUserTokens(Long userId) {
        try {
            refreshTokenRepository.deleteAllByUserId(userId);
            log.info("Deleted all refresh tokens for userId={}", userId);
        }
        catch (Exception e) {
        	log.error("Failed to delete all refresh tokens for userId={}", userId, e);
            throw new InternalServerException("Failed to delete user tokens");
        }
    }
}
