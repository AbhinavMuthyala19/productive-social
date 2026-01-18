package com.productive.social.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileStatsResponse {

    private long posts;
    private long communities;

    // placeholders for future streak system
    private int streak;
    private int longestStreak;
}
