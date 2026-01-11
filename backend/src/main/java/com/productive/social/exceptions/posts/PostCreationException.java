package com.productive.social.exceptions.posts;

import com.productive.social.exceptions.InternalServerException;

public class PostCreationException extends InternalServerException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PostCreationException(String message) {
        super(message);
    }

    public String getErrorCode() {
        return "POST_702_CREATE_FAILED";
    }
}
