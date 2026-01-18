package com.productive.social.service;

import com.productive.social.dao.profile.ProfileDAO;
import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.entity.User;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileDAO profileDAO;
    private final AuthService authService;

    /**
     * -----------------------------------------
     * Get current logged-in user's profile
     * -----------------------------------------
     */
    public UserProfileResponse getMyProfile() {
        try {
            User currentUser = authService.getCurrentUser();

            log.info("Fetching profile for current user. userId={}", currentUser.getId());

            UserProfileResponse response =
                    profileDAO.getUserProfile(currentUser.getId());

            log.info("Profile loaded successfully. userId={}", currentUser.getId());

            return response;
        }
        catch (NotFoundException e) {
            log.warn("Profile not found for current user");
            throw e;
        }
        catch (Exception e) {
            log.error("Failed to load profile for current user", e);
            throw new InternalServerException("Failed to load user profile");
        }
    }

    /**
     * -----------------------------------------
     * Get public user profile by userId
     * -----------------------------------------
     */
    public UserProfileResponse getUserProfile(Long userId) {
        try {
            log.info("Fetching public profile. userId={}", userId);

            UserProfileResponse response =
                    profileDAO.getUserProfile(userId);

            if (response == null) {
                log.warn("User profile not found. userId={}", userId);
                throw new NotFoundException("User not found");
            }

            log.info("Public profile loaded successfully. userId={}", userId);

            return response;
        }
        catch (NotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            log.error("Failed to load public profile. userId={}", userId, e);
            throw new InternalServerException("Failed to load user profile");
        }
    }
}
