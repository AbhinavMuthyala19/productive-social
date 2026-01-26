package com.productive.social.dto.posts;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostCommunityDTO {
    private Long id;
    private String name;
    private Integer streak;
}
