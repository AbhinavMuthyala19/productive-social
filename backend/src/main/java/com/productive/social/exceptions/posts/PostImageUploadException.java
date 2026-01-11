package com.productive.social.exceptions.posts;

import com.productive.social.exceptions.InternalServerException;

public class PostImageUploadException extends InternalServerException {
    public PostImageUploadException(String message) {
        super(message);
    }

    public String getErrorCode() {
        return "POST_703_IMAGE_FAILED";
    }
}
