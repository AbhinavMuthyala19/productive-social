package com.productive.social.dto.notes;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotesResponse {

    private Long id;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private String visibility;
    private LocalDateTime createdAt;
}