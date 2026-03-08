package com.productive.social.repository;

import com.productive.social.entity.EmailVerificationToken;
import com.productive.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findTopByUserOrderByExpiresAtDesc(User user);
}