package com.productive.social.service;


import com.productive.social.entity.PasswordResetToken;
import com.productive.social.repository.PasswordResetTokenRepository;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.notification.event.PasswordResetEmailEvent;
import com.productive.social.entity.User;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    private static final int RESET_TOKEN_EXPIRY_MINUTES = 30;

    public void requestPasswordReset(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String rawToken = UUID.randomUUID().toString();

        PasswordResetToken token = PasswordResetToken.builder()
                .user(user)
                .tokenHash(passwordEncoder.encode(rawToken))
                .expiresAt(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES))
                .used(false)
                .build();

        tokenRepository.save(token);

        String resetLink =
                "http://localhost:3000/reset-password?token=" + rawToken;

        eventPublisher.publishEvent(
                new PasswordResetEmailEvent(
                        user.getEmail(),
                        user.getName(),
                        resetLink
                )
        );
    }
    
    
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken = tokenRepository.findAll()
                .stream()
                .filter(t -> passwordEncoder.matches(token, t.getTokenHash()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Token already used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token expired");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
