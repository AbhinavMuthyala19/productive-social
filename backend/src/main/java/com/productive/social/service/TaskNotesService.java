package com.productive.social.service;

import com.productive.social.dao.notes.TaskNotesDAO;
import com.productive.social.entity.TaskNotes;
import com.productive.social.exceptions.notes.NotesLinkingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskNotesService {

    private final TaskNotesDAO taskNotesDao;

    @Transactional
    public TaskNotes linkNotesToTask(Long taskId, Long notesId) {
        try {
            TaskNotes taskNotes = TaskNotes.builder()
                    .taskId(taskId)
                    .notesId(notesId)
                    .linkedAt(LocalDateTime.now())
                    .build();

            return taskNotesDao.save(taskNotes);

        } catch (Exception ex) {
            throw new NotesLinkingException("Failed to link notes to task");
        }
    }

    public List<Long> getNotesIdsByTask(Long taskId) {
        return taskNotesDao.findNotesIdsByTaskId(taskId);
    }
}