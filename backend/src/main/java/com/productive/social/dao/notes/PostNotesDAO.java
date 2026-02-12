package com.productive.social.dao.notes;


import com.productive.social.entity.PostNotes;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostNotesDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public PostNotes save(PostNotes postNotes) {
        entityManager.persist(postNotes);
        return postNotes;
    }

    public List<Long> findNotesIdsByPostId(Long postId) {
        return entityManager.createQuery(
                        "SELECT pn.notesId FROM PostNotes pn WHERE pn.postId = :postId",
                        Long.class
                )
                .setParameter("postId", postId)
                .getResultList();
    }

    public List<Long> findPostIdsByNotesId(Long notesId) {
        return entityManager.createQuery(
                        "SELECT pn.postId FROM PostNotes pn WHERE pn.notesId = :notesId",
                        Long.class
                )
                .setParameter("notesId", notesId)
                .getResultList();
    }
}
