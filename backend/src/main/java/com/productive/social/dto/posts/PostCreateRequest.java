package com.productive.social.dto.posts;

import lombok.Data;

@Data
public class PostCreateRequest {

    private Long communityId;
    private String content;
    private String title;

    // Images will come through MultipartFile[] in controller
    // but we keep this DTO simple and clean

    private Long noteAttachmentId; // future use
}
