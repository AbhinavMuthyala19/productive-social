package com.productive.social.service;

import org.springframework.web.multipart.MultipartFile;

import com.productive.social.enums.UploadType;

public interface ImageStorageService {
    String store(MultipartFile file, UploadType type) ;
    void delete(String path);
}
