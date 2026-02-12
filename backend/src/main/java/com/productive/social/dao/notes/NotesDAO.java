package com.productive.social.dao.notes;


import com.productive.social.entity.Notes;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class NotesDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public Notes save(Notes notes) {
        entityManager.persist(notes);
        return notes;
    }

    public Optional<Notes> findById(Long notesId) {
        return Optional.ofNullable(
                entityManager.find(Notes.class, notesId)
        );
    }

    public List<Notes> findByUserId(Long userId) {
        return entityManager.createQuery(
                        "SELECT n FROM Notes n WHERE n.userId = :userId ORDER BY n.createdAt DESC",
                        Notes.class
                )
                .setParameter("userId", userId)
                .getResultList();
    }
}
