package com.productive.social.dao.notes;

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

    public List<Long> findNotesIdsByTaskId(Long taskId) {
        return entityManager.createQuery(
                        "SELECT tn.notesId FROM TaskNotes tn WHERE tn.taskId = :taskId",
                        Long.class
                )
                .setParameter("taskId", taskId)
                .getResultList();
    }
}