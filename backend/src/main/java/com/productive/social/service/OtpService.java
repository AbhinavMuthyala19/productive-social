package com.productive.social.service;

import com.productive.social.entity.EmailVerificationToken;
import com.productive.social.repository.EmailVerificationTokenRepository;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.entity.User;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int OTP_EXPIRY_MINUTES = 10;

    /**
     * Generates OTP, stores hashed value, returns plain OTP.
     */
    public String generateVerificationOtp(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String otp = generateOtp();

        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .verified(false)
                .build();

        tokenRepository.save(token);

        return otp;
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
    
    public void verifyOtp(Long userId, String otp) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        EmailVerificationToken token = tokenRepository
                .findTopByUserOrderByExpiresAtDesc(user)
                .orElseThrow(() -> new BadRequestException("No OTP found"));

        if (token.isVerified()) {
            throw new BadRequestException("OTP already used");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP expired");
        }

        if (!passwordEncoder.matches(otp, token.getOtpHash())) {
            throw new BadRequestException("Invalid OTP");
        }

        token.setVerified(true);
        tokenRepository.save(token);

        user.setEmailVerified(true);
        userRepository.save(user);
    }
    
    public String resendVerificationOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.isEmailVerified()) {
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

        return otp;
    }
}