package com.productive.social.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.productive.social.dao.profile.ProfileDAO;
import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.dto.profile.UserProfileUpdateRequest;
import com.productive.social.entity.User;
import com.productive.social.enums.UploadType;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.files.FileSizeExceededException;
import com.productive.social.exceptions.files.InvalidFileException;
import com.productive.social.repository.UserRepository;
import com.productive.social.storage.GenericFileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileDAO profileDAO;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final GenericFileStorageService genericFileStorageService;
    private final FileValidationService fileValidationService;
    private final FileSystemImageStorageService fileSystemImageStorageService;

    /**
     * -----------------------------------------
     * Get current logged-in user's profile
     * -----------------------------------------
     */
    public UserProfileResponse getMyProfile() {
        User currentUser = authService.getCurrentUser();

        try {
            log.info("Fetching profile (self). userId={}", currentUser.getId());

            UserProfileResponse response =
                    profileDAO.getUserProfile(currentUser.getId());

            if (response == null) {
                throw new NotFoundException("User not found");
            }

            log.info("Profile loaded successfully (self). userId={}", currentUser.getId());

            return response;

        } catch (NotFoundException e) {
            throw e;

        } catch (Exception e) {
            log.error("Profile load failed (self). userId={}", currentUser.getId(), e);
            throw new InternalServerException("Failed to load user profile");
        }
    }


    /**
     * -----------------------------------------
     * Get public user profile
     * -----------------------------------------
     */
    public UserProfileResponse getUserProfile(String userName) {
        try {
            log.info("Fetching profile (public). userName={}", userName);
            User user = userRepository.findByUsername(userName)
                    .orElseThrow(() ->
                            new NotFoundException("User not found"));

            Long userId = user.getId();

            UserProfileResponse response =
                    profileDAO.getUserProfile(userId);

            if (response == null) {
                log.warn("Public profile not found. userId={}", userId);
                throw new NotFoundException("User not found");
            }

            log.info("Profile loaded successfully (public). userId={}", userId);

            return response;

        } catch (NotFoundException e) {
            throw e;

        } catch (Exception e) {
            log.error(
                    "Profile load failed (public). userName={}",
                    userName,
                    e
            );
            throw new InternalServerException("Failed to load user profile");
        }
    }
    
    @Transactional
    public UserProfileResponse updateMyProfile(UserProfileUpdateRequest request) {

        User currentUser = authService.getCurrentUser();

        try {
            log.info("Updating profile. userId={}", currentUser.getId());

            if (request.getUsername() != null &&
                    !request.getUsername().equals(currentUser.getUsername())) {

                if (userRepository.existsByUsername(request.getUsername())) {
                    throw new IllegalArgumentException("Username already taken");
                }
                currentUser.setUsername(request.getUsername());
            }

            if (request.getEmail() != null &&
                    !request.getEmail().equals(currentUser.getEmail())) {

                if (userRepository.existsByEmail(request.getEmail())) {
                    throw new IllegalArgumentException("Email already in use");
                }
                currentUser.setEmail(request.getEmail());
            }

            if (request.getName() != null)
                currentUser.setName(request.getName());

            if (request.getBio() != null)
                currentUser.setBio(request.getBio());

            userRepository.save(currentUser);

            log.info("Profile updated successfully. userId={}", currentUser.getId());

            return profileDAO.getUserProfile(currentUser.getId());

        } catch (IllegalArgumentException e) {
            throw e;

        } catch (Exception e) {
            log.error("Profile update failed. userId={}", currentUser.getId(), e);
            throw new InternalServerException("Failed to update profile");
        }
    }
    
    @Transactional
    public UserProfileResponse updateProfilePicture(MultipartFile file) {

        User currentUser = authService.getCurrentUser();
        Long userId = currentUser.getId();

        try {
            log.info("Updating profile picture. userId={}", userId);

            // 1️⃣ Validate file
            fileValidationService.validateImage(file, 5);

            // 2️⃣ Delete old picture if exists
            if (currentUser.getProfilePicture() != null) {
                genericFileStorageService.delete(currentUser.getProfilePicture());
            }

            // 3️⃣ Store new file
            String stored = fileSystemImageStorageService.store(
                    file,
                    UploadType.PROFILE_PICTURE
            );

            // 4️⃣ Save relative path
            currentUser.setProfilePicture(stored);
            userRepository.save(currentUser);

            return profileDAO.getUserProfile(userId);

        } catch (InvalidFileException | FileSizeExceededException e) {
            log.warn("Profile picture validation failed. userId={}, error={}", userId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Failed to update profile picture. userId={}", userId, e);
            throw new InternalServerException("Failed to update profile picture");
        }
    }


   
}
