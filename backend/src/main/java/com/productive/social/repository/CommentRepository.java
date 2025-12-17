package com.productive.social.repository;

import com.productive.social.entity.Comment;
import com.productive.social.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all top-level comments for a post
    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtAsc(Post post);

    // Get replies for a comment
    List<Comment> findByParentCommentOrderByCreatedAtAsc(Comment parent);
}
