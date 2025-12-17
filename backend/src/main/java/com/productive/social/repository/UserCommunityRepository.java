package com.productive.social.repository;

import com.productive.social.entity.UserCommunity;
import com.productive.social.entity.Community;
import com.productive.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCommunityRepository extends JpaRepository<UserCommunity, Long> {

    List<UserCommunity> findByUser(User user);

    Optional<UserCommunity> findByUserAndCommunity(User user, Community community);
    
    boolean existsByUserIdAndCommunityId(Long userId, Long communityId);

	Long countByUserId(Long userId);
}
