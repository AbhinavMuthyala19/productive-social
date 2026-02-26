package com.productive.social.service;

import com.productive.social.exceptions.posts.PostImageUploadException;
import com.productive.social.storage.GenericFileStorageService;
import com.productive.social.enums.UploadType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileSystemImageStorageService implements ImageStorageService {

    private final GenericFileStorageService storageService;
    private final AuthService authService;

    @Override
    public String store(MultipartFile file, UploadType type) {

        Long userId = authService.getCurrentUser().getId();

        try {

            var stored = storageService.store(
                    file,
                    userId,
                    type
            );

            // Convert to relative path inside uploads
            return extractUploadsRelativePath(stored.path());

        } catch (Exception e) {
            log.error("Error saving image to filesystem for userId={}", userId, e);
            throw new PostImageUploadException("Failed to store image");
        }
    }

    private String extractUploadsRelativePath(String absolutePath) {

        int index = absolutePath.indexOf("uploads");

        if (index == -1) {
            throw new IllegalStateException("Uploads folder not found in path");
        }

        return absolutePath.substring(index).replace("\\", "/");
    }
}