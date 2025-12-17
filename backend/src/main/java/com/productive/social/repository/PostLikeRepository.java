package com.productive.social.repository;

import com.productive.social.entity.PostLike;
import com.productive.social.entity.Post;
import com.productive.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    // Check if user already liked a post
    boolean existsByPostAndUser(Post post, User user);

    // Delete like (for unlike)
    void deleteByPostAndUser(Post post, User user);

    // Count likes on a post
    long countByPost(Post post);
}
