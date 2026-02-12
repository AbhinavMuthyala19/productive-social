package com.productive.social.controllers;

import com.productive.social.entity.PostNotes;
import com.productive.social.service.PostNotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostNotesController {

    private final PostNotesService postNotesService;

    @PostMapping("/{postId}/notes/{notesId}")
    public ResponseEntity<PostNotes> linkNotesToPost(
            @PathVariable Long postId,
            @PathVariable Long notesId
    ) {
        return ResponseEntity.ok(
                postNotesService.linkNotesToPost(postId, notesId)
        );
    }
}