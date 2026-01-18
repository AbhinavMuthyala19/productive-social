package com.productive.social.dao.profile;

import com.productive.social.dto.profile.UserProfileResponse;

public interface ProfileDAO {

    UserProfileResponse getUserProfile(Long userId);
}
