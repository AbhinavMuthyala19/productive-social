package com.productive.social.service;

import com.productive.social.dto.auth.AuthResponse;
import com.productive.social.dto.auth.LoginRequest;
import com.productive.social.dto.auth.RegisterRequest;
import com.productive.social.dto.auth.UserMeResponse;
import com.productive.social.entity.RefreshToken;
import com.productive.social.entity.User;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;
import com.productive.social.security.CustomUserDetails;
import com.productive.social.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public final RefreshTokenService refreshTokenService;
    public final UserCommunityRepository userCommunityRepository;

    public String register(RegisterRequest request) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 2. Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // 3. Create new user with encrypted password
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // 4. Save user
        userRepository.save(user);

        // 5. Return message for now (token will be added in Step 5)
        return "User registered successfully!";
    }
    
//    public String login(LoginRequest request) {
//
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
//        );
//
//        return jwtUtil.generateToken(request.getEmail());
//    }
    public AuthResponse login(LoginRequest request) {
    	// 1. Try to find user by either email or username
        User user = userRepository
                .findByEmailOrUsername(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));
        
        
        // 2. Authenticate using resolved username (Spring Security matches password from DB)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        String accessToken = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }



    public AuthResponse refresh(String refreshToken) {

        RefreshToken token = refreshTokenService.validateRefreshToken(refreshToken);

        String newAccessToken = jwtUtil.generateToken(token.getUser().getEmail());

        // optional: rotate refresh token
        refreshTokenService.deleteToken(refreshToken);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(token.getUser());

        return new AuthResponse(newAccessToken, newRefreshToken.getToken());
    }

    
    public String logout(String refreshToken) {
        refreshTokenService.deleteToken(refreshToken);
        return "Logged out successfully.";
    }
    
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return userRepository.findById(customUserDetails.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        throw new RuntimeException("No authenticated user");
    }
    
    
    public UserMeResponse getCurrentUserProfile() {

        User user = getCurrentUser();

        Long joinedCommunitiesCount =
                userCommunityRepository.countByUserId(user.getId());

        return UserMeResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .joinedCommunitiesCount(joinedCommunitiesCount)
                .createdAt(user.getCreatedAt())
                .build();
    }




}
