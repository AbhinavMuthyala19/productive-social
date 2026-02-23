package com.productive.social.config;

import com.productive.social.repository.SystemConfigRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UploadConfigService {

    private static final String CONFIG_KEY = "UPLOAD_BASE_PATH";

    private final SystemConfigRepository configRepository;

    private String uploadBasePath;

    @PostConstruct
    public void init() {

        uploadBasePath = configRepository.findByKey(CONFIG_KEY)
                .map(c -> c.getValue())
                .orElseGet(() -> System.getProperty("user.dir"));
    }

    public String getUploadBasePath() {
        return uploadBasePath;
    }
}