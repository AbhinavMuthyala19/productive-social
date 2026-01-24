package com.productive.social.dao;

import com.productive.social.entity.Community;
import com.productive.social.enums.MembershipStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CommunityDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public int getMemberCount(Long communityId) {
        String query = "SELECT COUNT(uc) FROM UserCommunity uc WHERE uc.community.id = :communityId";

        Long count = (Long) entityManager.createQuery(query)
                .setParameter("communityId", communityId)
                .getSingleResult();

        return count.intValue();
    }

    public List<Community> getAllCommunities() {
        return entityManager.createQuery("SELECT c FROM Community c", Community.class)
                .getResultList();
    }
    

    // ===========================
    // 2️⃣ JOINED COMMUNITIES
    // ===========================
    public List<Community> getCommunitiesJoinedByUser(Long userId) {

        return entityManager.createQuery(
                """
                SELECT c
                FROM Community c
                JOIN UserCommunity uc
                    ON uc.community.id = c.id
                WHERE uc.user.id = :userId
                  AND uc.status = :status
                """,
                Community.class
        )
        .setParameter("userId", userId)
        .setParameter("status", MembershipStatus.ACTIVE)
        .getResultList();
    }
}
