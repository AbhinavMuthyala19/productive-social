package com.productive.social.controllers;

import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * -----------------------------------------
     * Get logged-in user's profile
     * -----------------------------------------
     *
     * GET /profile/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    /**
     * -----------------------------------------
     * Get public user profile
     * -----------------------------------------
     *
     * GET /profile/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(profileService.getUserProfile(userId));
    }
}
