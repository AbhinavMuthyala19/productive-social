package com.productive.social.controllers;

import com.productive.social.entity.TaskNotes;
import com.productive.social.service.TaskNotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskNotesController {

    private final TaskNotesService taskNotesService;

    @PostMapping("/{taskId}/notes/{notesId}")
    public ResponseEntity<TaskNotes> linkNotesToTask(
            @PathVariable Long taskId,
            @PathVariable Long notesId
    ) {
        return ResponseEntity.ok(
                taskNotesService.linkNotesToTask(taskId, notesId)
        );
    }

    @GetMapping("/{taskId}/notes")
    public ResponseEntity<List<Long>> getNotesUnderTask(
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(
                taskNotesService.getNotesIdsByTask(taskId)
        );
    }
}