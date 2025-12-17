package com.productive.social.repository;

import com.productive.social.entity.Post;
import com.productive.social.entity.User;
import com.productive.social.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Get posts by community (for community feed)
    List<Post> findByCommunityOrderByCreatedAtDesc(Community community);

    // Get posts by user (user profile)
    List<Post> findByUserOrderByCreatedAtDesc(User user);
}
