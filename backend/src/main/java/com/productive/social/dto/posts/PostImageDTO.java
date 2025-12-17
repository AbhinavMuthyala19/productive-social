package com.productive.social.dto.posts;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostImageDTO {
    private String imageUrl;
    private Integer ordering;
}
