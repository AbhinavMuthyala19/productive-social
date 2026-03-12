package com.productive.social.dao.notes;

import com.productive.social.entity.Notes;
import com.productive.social.entity.TaskNotes;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskNotesDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public TaskNotes save(TaskNotes taskNotes) {
        entityManager.persist(taskNotes);
        return taskNotes;
    }

    public List<Notes> findNotesByTaskId(Long taskId) {

        return entityManager.createQuery(
                """
                SELECT n
                FROM TaskNotes tn
                JOIN Notes n ON tn.notesId = n.id
                WHERE tn.taskId = :taskId
                """,
                Notes.class
        )
        .setParameter("taskId", taskId)
        .getResultList();
    }
}