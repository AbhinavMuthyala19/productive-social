package com.productive.social.dto.notes;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotesUploadRequest {

    // Optional — user may select a task
    private Long taskId;

    // Future extensibility
    private String visibility; // optional for later (PUBLIC/PRIVATE)
}