package com.productive.social.exceptions.notes;


public class FileStorageException extends RuntimeException {
    public FileStorageException(String message) {
        super(message);
    }
}