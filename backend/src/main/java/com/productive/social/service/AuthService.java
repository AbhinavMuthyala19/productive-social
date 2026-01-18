package com.productive.social.service;

import com.productive.social.dto.auth.AuthResponse;
import com.productive.social.dto.auth.LoginRequest;
import com.productive.social.dto.auth.RegisterRequest;
import com.productive.social.dto.auth.UserMeResponse;
import com.productive.social.entity.RefreshToken;
import com.productive.social.entity.User;
import com.productive.social.exceptions.BadRequestException;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.UnauthorizedException;
import com.productive.social.logging.NoisyLogLimiter;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;
import com.productive.social.security.CustomUserDetails;
import com.productive.social.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public final RefreshTokenService refreshTokenService;
    public final UserCommunityRepository userCommunityRepository;

    // -------------------------
    // REGISTER
    // -------------------------
    public String register(RegisterRequest request) {
        try {
            // 1. Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
            	log.warn("Registration failed - email already exists {}", request.getEmail());
                throw new BadRequestException("Email already exists");
            }

            // 2. Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
            	log.warn("Registration failed - username already exists {}", request.getUsername());
                throw new BadRequestException("Username already exists");
            }

            // 3. Create new user with encrypted password
            User user = User.builder()
                    .username(request.getUsername())
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .build();
            

            // 4. Save user
            userRepository.save(user);
            
            log.info("User registered successfully. userId={}", user.getId());
            return "User registered successfully!";
        }
        catch (BadRequestException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Unexpected error during registration", e);
            throw new InternalServerException("Failed to register user");
        }
    }

    // -------------------------
    // LOGIN
    // -------------------------
    public AuthResponse login(LoginRequest request) {
        try {
            // 1. Try to find user by either email or username
            User user = userRepository
                    .findByEmailOrUsername(request.getIdentifier(), request.getIdentifier())
                    .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password"));

            // 2. Authenticate credentials (may throw)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );

            String accessToken = jwtUtil.generateToken(user.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            
            log.info("User logged in successfully. userId={}", user.getId());

            return new AuthResponse(accessToken, refreshToken.getToken());
        }
        // ✅ WRONG PASSWORD / USER ERROR
        catch (BadCredentialsException e) {

            if (NoisyLogLimiter.shouldLog("bad-login-attempt", 30)) {
                log.warn("Invalid login credentials attempts detected (rate-limited)");
            }

            throw new UnauthorizedException("Invalid username/email or password");
        }

        // ✅ USER NOT FOUND / EXPLICIT UNAUTHORIZED
        catch (UnauthorizedException e) {

            if (NoisyLogLimiter.shouldLog("bad-login-attempt", 30)) {
                log.warn("Unauthorized login attempts detected (rate-limited)");
            }

            throw e;
        }

        // ❌ REAL SYSTEM FAILURE
        catch (Exception e) {

            if (NoisyLogLimiter.shouldLog("login-system-error", 60)) {
                log.error(
                        "Unexpected login system failure (rate-limited). identifier={}",
                        request.getIdentifier(),
                        e
                );
            }

            throw new UnauthorizedException("Invalid username/email or password");
        }
    }

    // -------------------------
    // REFRESH TOKEN
    // -------------------------
    public AuthResponse refresh(String refreshToken) {
        try {
            RefreshToken token = refreshTokenService.validateRefreshToken(refreshToken);

            String newAccessToken = jwtUtil.generateToken(token.getUser().getEmail());

            refreshTokenService.deleteToken(refreshToken);
            RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(token.getUser());

            log.info("Refresh token rotated. userId={}", token.getUser().getId());
            return new AuthResponse(newAccessToken, newRefreshToken.getToken());
        }
        catch (UnauthorizedException e) {
            throw e;
        }
        catch (Exception e) {
        	log.error("Unexpected error while refreshing token", e);
            throw new InternalServerException("Failed to refresh token");
        }
    }

    // -------------------------
    // LOGOUT
    // -------------------------
    public String logout(String refreshToken) {
        try {
            refreshTokenService.deleteToken(refreshToken);
            log.info("User logged out successfully.");
            return "Logged out successfully.";
        }
        catch (Exception e) {
        	log.error("Unexpected error during logout", e);
            throw new InternalServerException("Failed to logout");
        }
    }

    // -------------------------
    // GET CURRENT USER ENTITY
    // -------------------------
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return userRepository.findById(customUserDetails.getUserId())
            		.orElseThrow(() -> {
                        log.warn("User not found in DB for principal userId={}", customUserDetails.getUserId());
                        return new UnauthorizedException("User not found");
                    });
        }

        log.warn("Access denied: no authenticated principal");
        throw new UnauthorizedException("No authenticated user");
    }

    // -------------------------
    // GET USER PROFILE
    // -------------------------
    public UserMeResponse getCurrentUserProfile() {
        User user = getCurrentUser();

        Long joinedCommunitiesCount =
                userCommunityRepository.countByUserId(user.getId());
        
        log.info("Fetched profile for userId={}", user.getId());

        return UserMeResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .joinedCommunitiesCount(joinedCommunitiesCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
