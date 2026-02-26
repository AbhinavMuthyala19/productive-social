package com.productive.social.service;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.productive.social.exceptions.files.FileSizeExceededException;
import com.productive.social.exceptions.files.InvalidFileException;

@Component
public class FileValidationService {

	public void validateImage(MultipartFile file, long maxSizeMb) {

	    if (file == null || file.isEmpty()) {
	        throw new InvalidFileException("File cannot be empty");
	    }

	    long maxBytes = maxSizeMb * 1024 * 1024;

	    if (file.getSize() > maxBytes) {
	        throw new FileSizeExceededException("File size exceeds " + maxSizeMb + "MB limit");
	    }

	    List<String> allowedTypes = List.of(
	            "image/jpeg",
	            "image/png",
	            "image/webp"
	    );

	    if (!allowedTypes.contains(file.getContentType())) {
	        throw new InvalidFileException("Unsupported file type");
	    }
	}
}
