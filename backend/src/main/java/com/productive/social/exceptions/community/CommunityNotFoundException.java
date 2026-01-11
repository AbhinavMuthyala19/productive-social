package com.productive.social.exceptions.community;

import com.productive.social.exceptions.NotFoundException;

public class CommunityNotFoundException extends NotFoundException {
    public CommunityNotFoundException(String message) {
        super(message);
    }

    public String getErrorCode() {
        return "COMMUNITY_404_NOT_FOUND";
    }
}
