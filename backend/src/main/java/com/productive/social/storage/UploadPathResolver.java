package com.productive.social.storage;

import com.productive.social.config.UploadConfigService;
import com.productive.social.enums.UploadType;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@RequiredArgsConstructor
public class UploadPathResolver {

    private final UploadConfigService configService;

    public Path resolveUserFolder(Long userId, UploadType type) {

        String basePath = configService.getUploadBasePath();

        return Paths.get(basePath)
                .resolve("uploads")
                .resolve(String.valueOf(userId))
                .resolve(type.getFolder());
    }
}