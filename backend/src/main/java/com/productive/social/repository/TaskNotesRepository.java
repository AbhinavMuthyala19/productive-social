package com.productive.social.repository;

import com.productive.social.entity.TaskNotes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskNotesRepository extends JpaRepository<TaskNotes, Long> {

    List<TaskNotes> findByTaskId(Long taskId);

    List<TaskNotes> findByNotesId(Long notesId);
}