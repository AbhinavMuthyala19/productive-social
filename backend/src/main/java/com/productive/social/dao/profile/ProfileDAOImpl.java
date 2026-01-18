package com.productive.social.dao.profile;

import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.dto.profile.UserProfileStatsResponse;
import com.productive.social.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProfileDAOImpl implements ProfileDAO {

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    public UserProfileResponse getUserProfile(Long userId) {

        // 1️⃣ Load user
        User user = entityManager.find(User.class, userId);

        // 2️⃣ Posts count
        Long postsCount = entityManager.createQuery(
                "SELECT COUNT(p.id) FROM Post p WHERE p.user.id = :userId",
                Long.class
        ).setParameter("userId", userId)
         .getSingleResult();

        // 3️⃣ Communities count
        Long communitiesCount = entityManager.createQuery(
                "SELECT COUNT(uc.id) FROM UserCommunity uc WHERE uc.user.id = :userId",
                Long.class
        ).setParameter("userId", userId)
         .getSingleResult();

        // 4️⃣ Build stats (streak placeholders)
        UserProfileStatsResponse stats =
                UserProfileStatsResponse.builder()
                        .posts(postsCount)
                        .communities(communitiesCount)
                        .streak(0)
                        .longestStreak(0)
                        .build();

        // 5️⃣ Build profile response
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .joinedAt(user.getCreatedAt())
                .stats(stats)
                .build();
    }
}
