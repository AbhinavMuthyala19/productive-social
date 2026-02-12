package com.productive.social.service;

import com.productive.social.dao.notes.NotesDAO;
import com.productive.social.dto.notes.NotesResponse;
import com.productive.social.dto.notes.NotesSummaryResponse;
import com.productive.social.dto.notes.NotesUploadRequest;
import com.productive.social.entity.Notes;
import com.productive.social.entity.Task;
import com.productive.social.entity.User;
import com.productive.social.enums.NotesVisibility;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.notes.FileStorageException;
import com.productive.social.exceptions.notes.NotesNotFoundException;
import com.productive.social.exceptions.tasks.TaskNotFoundException;
import com.productive.social.repository.TaskRepository;
import com.productive.social.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotesService {

    private final NotesDAO notesDao;
    private final FileStorageService fileStorageService;
    private final AuthService authService;
    private final TaskRepository taskRepository;
    private final TaskNotesService taskNotesService;
    private final UserRepository userRepository;

    @Transactional
    public NotesResponse uploadNotes(MultipartFile file,
                                     NotesUploadRequest request) {

        User currentUser = authService.getCurrentUser();
        Long userId = currentUser.getId();

        try {

            // -------------------------
            // 1. Store file
            // -------------------------
            FileStorageService.StoredFileData fileData =
                    fileStorageService.storeFile(file, userId);

            // -------------------------
            // 2. Save Notes metadata
            // -------------------------
            Notes notes = Notes.builder()
                    .userId(userId)
                    .originalFileName(fileData.originalName())
                    .storedFileName(fileData.storedName())
                    .filePath(fileData.path())
                    .contentType(fileData.contentType())
                    .fileSize(fileData.size())
                    .visibility(NotesVisibility.PUBLIC)
                    .createdAt(LocalDateTime.now())
                    .build();

            Notes saved = notesDao.save(notes);

            // -------------------------
            // 3. Optional Task linking
            // -------------------------
            if (request != null && request.getTaskId() != null) {

                Task task = taskRepository.findById(request.getTaskId())
                        .orElseThrow(() ->
                                new TaskNotFoundException(request.getTaskId())
                        );

                taskNotesService.linkNotesToTask(
                        task.getId(),
                        saved.getId()
                );
            }

            return mapToResponse(saved);

        } catch (FileStorageException ex) {
            log.error("File storage failed for userId={}", userId, ex);
            throw ex;
        } catch (Exception ex) {
            log.error("Notes upload failed for userId={}", userId, ex);
            throw new RuntimeException("Failed to upload notes");
        }
    }
    
    @Transactional
    public Notes uploadNotesFromPost(MultipartFile file) {

        User currentUser = authService.getCurrentUser();
        Long userId = currentUser.getId();

        FileStorageService.StoredFileData fileData =
                fileStorageService.storeFile(file, userId);

        Notes notes = Notes.builder()
                .userId(userId)
                .originalFileName(fileData.originalName())
                .storedFileName(fileData.storedName())
                .filePath(fileData.path())
                .contentType(fileData.contentType())
                .fileSize(fileData.size())
                .visibility(NotesVisibility.PUBLIC)
                .createdAt(LocalDateTime.now())
                .build();

        return notesDao.save(notes);
    }

//    public NotesResponse getNotesById(Long notesId) {
//        Notes notes = notesDao.findById(notesId)
//                .orElseThrow(() -> new NotesNotFoundException(notesId));
//
//        return mapToResponse(notes);
//    }

    public List<NotesSummaryResponse> getNotesByUserId(Long userId) {

        return notesDao.findByUserId(userId)
                .stream()
                .map(n -> NotesSummaryResponse.builder()
                        .id(n.getId())
                        .originalFileName(n.getOriginalFileName())
                        .fileSize(n.getFileSize())
                        .build())
                .collect(Collectors.toList());
    }
    
    
    public List<NotesSummaryResponse> getNotesByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new NotFoundException("User not found: " + username)
                );

        return getNotesByUserId(user.getId());
    }

    private NotesResponse mapToResponse(Notes notes) {
        return NotesResponse.builder()
                .id(notes.getId())
                .originalFileName(notes.getOriginalFileName())
                .contentType(notes.getContentType())
                .fileSize(notes.getFileSize())
                .visibility(notes.getVisibility().name())
                .createdAt(notes.getCreatedAt())
                .build();
    }
    
    
    public Notes getNotesEntityById(Long notesId) {
        return notesDao.findById(notesId)
                .orElseThrow(() -> new NotesNotFoundException(notesId));
    }
}