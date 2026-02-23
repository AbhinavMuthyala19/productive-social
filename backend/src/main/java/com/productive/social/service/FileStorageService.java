package com.productive.social.service;

import com.productive.social.exceptions.notes.FileStorageException;
import com.productive.social.storage.GenericFileStorageService;
import com.productive.social.enums.UploadType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final GenericFileStorageService storageService;
    private final AuthService authService;

    // ----------------------------------------------------
    // STORE FILE (Notes)
    // ----------------------------------------------------
    public StoredFileData storeFile(MultipartFile file) {

        Long userId = authService.getCurrentUser().getId();

        try {
            var stored = storageService.store(
                    file,
                    userId,
                    UploadType.NOTES
            );

            return new StoredFileData(
                    stored.originalName(),
                    stored.storedName(),
                    stored.path(),
                    stored.contentType(),
                    stored.size()
            );

        } catch (Exception e) {
            throw new FileStorageException("Failed to store file");
        }
    }

    // ----------------------------------------------------
    // LOAD FILE
    // ----------------------------------------------------
    public Path loadFile(String filePath) {

        Path path = Paths.get(filePath);

        if (!Files.exists(path)) {
            throw new FileStorageException("File not found");
        }

        return path;
    }

    // ----------------------------------------------------
    // DTO RECORD (unchanged contract)
    // ----------------------------------------------------
    public record StoredFileData(
            String originalName,
            String storedName,
            String path,
            String contentType,
            Long size
    ) {}
}