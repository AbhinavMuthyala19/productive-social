package com.productive.social.enums;


public enum UploadType {
    PROFILE_PICTURE("profile-picture"),
    POST_IMAGE("post-images"),
    NOTES("notes");

    private final String folder;

    UploadType(String folder) {
        this.folder = folder;
    }

    public String getFolder() {
        return folder;
    }
}
