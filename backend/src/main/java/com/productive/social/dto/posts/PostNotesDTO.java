package com.productive.social.dto.posts;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostNotesDTO {

    private Long id;
    private String originalFileName;
    private Long fileSize;
}