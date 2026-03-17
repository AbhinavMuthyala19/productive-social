package com.productive.social.service;

import com.productive.social.entity.EmailVerificationToken;
import com.productive.social.repository.EmailVerificationTokenRepository;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.entity.User;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int OTP_EXPIRY_MINUTES = 10;

    @Transactional
    public String generateVerificationOtp(Long userId) {

        try {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.warn("OTP generation failed - user not found. userId={}", userId);
                        return new BadRequestException("User not found");
                    });

            String otp = generateOtp();

            EmailVerificationToken token = EmailVerificationToken.builder()
                    .user(user)
                    .otpHash(passwordEncoder.encode(otp))
                    .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                    .verified(false)
                    .build();

            tokenRepository.save(token);

            log.info("OTP generated successfully for userId={}", userId);

            return otp;

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during OTP generation. userId={}", userId, e);
            throw new InternalServerException("Failed to generate OTP");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    @Transactional
    public void verifyOtp(String email, String otp) {

        try {

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("OTP verification failed - user not found. email={}", email);
                        return new BadRequestException("User not found");
                    });
            

            EmailVerificationToken token = tokenRepository
                    .findTopByUserOrderByExpiresAtDesc(user)
                    .orElseThrow(() -> {
                        log.warn("OTP verification failed - no OTP found. email={}", email);
                        return new BadRequestException("No OTP found");
                    });

            if (token.isVerified()) {
                log.warn("OTP verification failed - OTP already used. email={}", email);
                throw new BadRequestException("OTP already used");
            }

            if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                log.warn("OTP verification failed - OTP expired. email={}", email);
                throw new BadRequestException("OTP expired");
            }

            if (!passwordEncoder.matches(otp, token.getOtpHash())) {
                log.warn("OTP verification failed - invalid OTP. email={}", email);
                throw new BadRequestException("Invalid OTP");
            }

            token.setVerified(true);
            tokenRepository.save(token);

            user.setEmailVerified(true);
            userRepository.save(user);

            log.info("OTP verified successfully. email={}", email);

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during OTP verification. email={}", email, e);
            throw new InternalServerException("Failed to verify OTP");
        }
    }

    @Transactional
    public String resendVerificationOtp(String email) {

        try {

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("Resend OTP failed - user not found. email={}", email);
                        return new BadRequestException("User not found");
                    });

            if (user.isEmailVerified()) {
                log.warn("Resend OTP failed - email already verified. email={}", email);
                throw new BadRequestException("Email already verified");
            }

            String otp = generateOtp();

            EmailVerificationToken token = EmailVerificationToken.builder()
                    .user(user)
                    .otpHash(passwordEncoder.encode(otp))
                    .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                    .verified(false)
                    .build();

            tokenRepository.save(token);

            log.info("OTP resent successfully. email={}", email);

            return otp;

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during resend OTP. email={}", email, e);
            throw new InternalServerException("Failed to resend OTP");
        }
    }
}