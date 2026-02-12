package com.productive.social.controllers;

import com.productive.social.dto.notes.NotesResponse;
import com.productive.social.dto.notes.NotesSummaryResponse;
import com.productive.social.dto.notes.NotesUploadRequest;
import com.productive.social.entity.Notes;
import com.productive.social.service.AuthService;
import com.productive.social.service.FileStorageService;
import com.productive.social.service.NotesService;
import com.productive.social.service.PostNotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
public class NotesController {

    private final NotesService notesService;
    private final FileStorageService fileStorageService;
    private final PostNotesService postNotesService;
    private final AuthService authService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NotesResponse> uploadNotes(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "data", required = false) NotesUploadRequest request
    ) {
        return ResponseEntity.ok(
                notesService.uploadNotes(file, request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotesSummaryResponse>> getMyNotes() {
        return ResponseEntity.ok(
                notesService.getNotesByUserId(
                        authService.getCurrentUser().getId()
                )
        );
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<NotesSummaryResponse>> getNotesByUsername(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(
                notesService.getNotesByUsername(username)
        );
    }

//    @GetMapping("/{notesId}")
//    public ResponseEntity<NotesResponse> getNotesById(@PathVariable Long notesId) {
//        return ResponseEntity.ok(notesService.getNotesById(notesId));
//    }

    @GetMapping("/{notesId}/download")
    public ResponseEntity<Resource> downloadNotes(@PathVariable Long notesId) {

        Notes notes = notesService.getNotesEntityById(notesId); 
        // we fetch entity internally, not DTO

        Path filePath = fileStorageService.loadFile(notes.getFilePath());

        Resource resource = new FileSystemResource(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + notes.getOriginalFileName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, notes.getContentType())
                .body(resource);
    }

    @GetMapping("/{notesId}/posts")
    public ResponseEntity<List<Long>> getPostsLinkedToNotes(@PathVariable Long notesId) {
        return ResponseEntity.ok(postNotesService.getPostIdsByNotes(notesId));
    }
}