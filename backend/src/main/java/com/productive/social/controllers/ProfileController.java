package com.productive.social.controllers;

import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.dto.profile.UserProfileUpdateRequest;
import com.productive.social.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
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

        log.debug("Received request: GET /profile/me");

        UserProfileResponse response =
                profileService.getMyProfile();

        log.debug("Returning profile for current user");

        return ResponseEntity.ok(response);
    }

    /**
     * -----------------------------------------
     * Get public user profile
     * -----------------------------------------
     *
     * GET /profile/{userId}
     */
    @GetMapping("/{userName}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable String userName
    ) {

        log.debug("Received request: GET /profile/{}", userName);

        UserProfileResponse response =
                profileService.getUserProfile(userName);

        log.debug("Returning public profile. userName={}", userName);

        return ResponseEntity.ok(response);
    }
    
 // -----------------------------------------
 // Update profile (username, name, bio, email)
 // -----------------------------------------
 @PatchMapping("/me")
 public ResponseEntity<UserProfileResponse> updateMyProfile(
         @RequestBody UserProfileUpdateRequest request
 ) {
     return ResponseEntity.ok(
             profileService.updateMyProfile(request)
     );
 }
 
 
//-----------------------------------------
//Upload / Update profile picture
//-----------------------------------------
@PostMapping(value = "/me/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<UserProfileResponse> updateProfilePicture(
      @RequestPart("file") MultipartFile file
) {
  return ResponseEntity.ok(
          profileService.updateProfilePicture(file)
  );
}
 
}
