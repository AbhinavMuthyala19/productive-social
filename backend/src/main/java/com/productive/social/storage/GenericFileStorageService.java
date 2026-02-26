package com.productive.social.storage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.productive.social.config.UploadConfigService;
import com.productive.social.enums.UploadType;

import java.nio.file.*;
import java.util.UUID;
@Slf4j
@Service
@RequiredArgsConstructor
public class GenericFileStorageService {

    private final UploadPathResolver pathResolver;
    private final UploadConfigService uploadConfigService;

    public StoredFileData store(
            MultipartFile file,
            Long userId,
            UploadType type
    ) {

        try {
            Path folder = pathResolver.resolveUserFolder(userId, type);
            Files.createDirectories(folder);

            String extension = getExtension(file.getOriginalFilename());
            String storedName = UUID.randomUUID() + extension;

            Path target = folder.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFileData(
                    file.getOriginalFilename(),
                    storedName,
                    target.toString(),
                    file.getContentType(),
                    file.getSize()
            );

        } catch (Exception e) {
            throw new RuntimeException("File storage failed", e);
        }
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
    
    public void delete(String relativePath) {

        try {
            if (relativePath == null || relativePath.isBlank()) {
                return;
            }

            // Convert "uploads/3/profile-pictures/file.png"
            // → absolute path using base path
            String basePath = uploadConfigService.getUploadBasePath();

            Path fullPath = Paths.get(basePath).resolve(relativePath);

            Files.deleteIfExists(fullPath);

            log.info("Deleted file: {}", fullPath);

        } catch (Exception e) {
            log.warn("Failed to delete file: {}", relativePath, e);
        }
    }
}