package com.productive.social.service;

import com.productive.social.dao.notes.PostNotesDAO;
import com.productive.social.entity.PostNotes;
import com.productive.social.exceptions.notes.NotesLinkingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostNotesService {

    private final PostNotesDAO postNotesDao;
    

    @Transactional
    public PostNotes linkNotesToPost(Long postId, Long notesId) {
        try {
            PostNotes postNotes = PostNotes.builder()
                    .postId(postId)
                    .notesId(notesId)
                    .linkedAt(LocalDateTime.now())
                    .build();

            return postNotesDao.save(postNotes);

        } catch (Exception ex) {
            throw new NotesLinkingException("Failed to link notes to post");
        }
    }

    public List<Long> getNotesIdsByPost(Long postId) {
        return postNotesDao.findNotesIdsByPostId(postId);
    }

    public List<Long> getPostIdsByNotes(Long notesId) {
        return postNotesDao.findPostIdsByNotesId(notesId);
    }
}