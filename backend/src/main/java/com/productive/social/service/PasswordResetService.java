package com.productive.social.service;

import com.productive.social.entity.PasswordResetToken;
import com.productive.social.repository.PasswordResetTokenRepository;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.notification.event.PasswordResetEmailEvent;
import com.productive.social.entity.User;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    private static final int RESET_TOKEN_EXPIRY_MINUTES = 30;

    @Transactional
    public void requestPasswordReset(String email) {

        try {

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("Password reset request failed - user not found. email={}", email);
                        return new BadRequestException("User not found");
                    });

            String rawToken = UUID.randomUUID().toString();

            PasswordResetToken token = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(passwordEncoder.encode(rawToken))
                    .expiresAt(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES))
                    .used(false)
                    .build();

            tokenRepository.save(token);

            String resetLink =
                    "http://localhost:5173/reset-password?token=" + rawToken;

            eventPublisher.publishEvent(
                    new PasswordResetEmailEvent(
                            user.getEmail(),
                            user.getName(),
                            resetLink
                    )
            );

            log.info("Password reset email triggered successfully. email={}", email);

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during password reset request. email={}", email, e);
            throw new InternalServerException("Failed to process password reset request");
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {

        try {

            PasswordResetToken resetToken = tokenRepository.findAll()
                    .stream()
                    .filter(t -> passwordEncoder.matches(token, t.getTokenHash()))
                    .findFirst()
                    .orElseThrow(() -> {
                        log.warn("Password reset failed - invalid token");
                        return new BadRequestException("Invalid reset token");
                    });

            if (resetToken.isUsed()) {
                log.warn("Password reset failed - token already used");
                throw new BadRequestException("Token already used");
            }

            if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                log.warn("Password reset failed - token expired");
                throw new BadRequestException("Token expired");
            }

            User user = resetToken.getUser();

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            resetToken.setUsed(true);
            tokenRepository.save(resetToken);

            log.info("Password reset successful. userId={}", user.getId());

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during password reset", e);
            throw new InternalServerException("Failed to reset password");
        }
    }
}