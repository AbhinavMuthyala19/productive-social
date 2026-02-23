package com.productive.social.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.productive.social.enums.UploadType;

import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GenericFileStorageService {

    private final UploadPathResolver pathResolver;

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
}