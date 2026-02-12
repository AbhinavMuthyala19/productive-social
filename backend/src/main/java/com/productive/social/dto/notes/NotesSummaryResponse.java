package com.productive.social.dto.notes;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotesSummaryResponse {

    private Long id;
    private String originalFileName;
    private Long fileSize;
}