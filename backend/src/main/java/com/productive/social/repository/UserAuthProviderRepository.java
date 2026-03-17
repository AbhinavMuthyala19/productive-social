package com.productive.social.repository;

import com.productive.social.entity.User;
import com.productive.social.entity.UserAuthProvider;
import com.productive.social.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAuthProviderRepository
        extends JpaRepository<UserAuthProvider, Long> {

    Optional<UserAuthProvider> findByAuthProviderAndAuthProviderId(
            AuthProvider provider,
            String providerId
    );

    Optional<UserAuthProvider> findByUserAndAuthProvider(
            User user,
            AuthProvider provider
    );
}