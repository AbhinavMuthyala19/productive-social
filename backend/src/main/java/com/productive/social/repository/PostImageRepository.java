package com.productive.social.repository;

import com.productive.social.entity.Post;
import com.productive.social.entity.PostImage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
	
	List<PostImage> findByPost(Post post);

}
