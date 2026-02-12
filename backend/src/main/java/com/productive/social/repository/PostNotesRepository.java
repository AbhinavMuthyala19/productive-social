package com.productive.social.repository;

import com.productive.social.entity.PostNotes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostNotesRepository extends JpaRepository<PostNotes, Long> {

    List<PostNotes> findByPostId(Long postId);

    List<PostNotes> findByNotesId(Long notesId);
}