package com.productive.social.service;

import com.productive.social.exceptions.notes.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public StoredFileData storeFile(MultipartFile file, Long userId) {

        try {
            String extension = getExtension(file.getOriginalFilename());
            String storedFileName = UUID.randomUUID() + extension;

            Path userDir = Paths.get(uploadDir, String.valueOf(userId));
            Files.createDirectories(userDir);

            Path target = userDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFileData(
                    file.getOriginalFilename(),
                    storedFileName,
                    target.toString(),
                    file.getContentType(),
                    file.getSize()
            );

        } catch (IOException e) {
            throw new FileStorageException("Failed to store file");
        }
    }

    public Path loadFile(String filePath) {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new FileStorageException("File not found");
        }
        return path;
    }

    private String getExtension(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf("."));
    }

    public record StoredFileData(
            String originalName,
            String storedName,
            String path,
            String contentType,
            Long size
    ) {}
}