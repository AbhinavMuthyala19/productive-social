package com.productive.social.controllers;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.productive.social.authprovider.dto.SsoLoginRequest;
import com.productive.social.authprovider.service.AuthProviderService;
import com.productive.social.dto.auth.AuthResponse;
import com.productive.social.dto.auth.LoginRequest;
import com.productive.social.dto.auth.RegisterRequest;
import com.productive.social.dto.auth.ResendOtpRequest;
import com.productive.social.dto.auth.ResetPasswordRequest;
import com.productive.social.dto.auth.UserMeResponse;
import com.productive.social.dto.auth.VerifyOtpRequest;
import com.productive.social.service.AuthService;
import com.productive.social.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthProviderService authProviderService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(
                authService.verifyOtp(request.getEmail(), request.getOtp())
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {

        // Call service to validate user and generate tokens
        AuthResponse authResult = authService.login(request);

        // Set cookies
        response.addHeader("Set-Cookie", CookieUtil.createAccessTokenCookie(authResult.getAccessToken()));
        response.addHeader("Set-Cookie", CookieUtil.createRefreshTokenCookie(authResult.getRefreshToken()));

        return ResponseEntity.ok(
                new HashMap<>() {{
                        put("message", "Login successful");
                }}
        );
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(authService.forgotPassword(email));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(
                        request.getToken(),
                        request.getNewPassword()
                )
        );
    }



    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        // Get refresh token from cookie
        String refreshToken = CookieUtil.getCookieValue(request, CookieUtil.REFRESH_TOKEN_COOKIE)
                .orElse(null);

        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token missing");
        }

        // Validate + rotate tokens
        AuthResponse authResult = authService.refresh(refreshToken);

        // Set updated cookies
        response.addHeader("Set-Cookie", CookieUtil.createAccessTokenCookie(authResult.getAccessToken()));
        response.addHeader("Set-Cookie", CookieUtil.createRefreshTokenCookie(authResult.getRefreshToken()));

        return ResponseEntity.ok(
                new HashMap<>() {{
                        put("message", "Token refreshed");
                }}
        );
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        // get refresh token from cookie
        var refreshTokenOpt = CookieUtil.getCookieValue(request, CookieUtil.REFRESH_TOKEN_COOKIE);

        refreshTokenOpt.ifPresent(refreshToken -> {
            try {
                authService.logout(refreshToken);
            } catch (Exception ignored) {
                // If already invalid/expired, we still proceed to clear cookies
            }
        });

        // clear cookies
        response.addHeader("Set-Cookie", CookieUtil.clearAccessTokenCookie());
        response.addHeader("Set-Cookie", CookieUtil.clearRefreshTokenCookie());

        return ResponseEntity.ok(
                new HashMap<>() {{
                        put("message", "Logged out successfully");
                }}
        );
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> me() {
        return ResponseEntity.ok(authService.getCurrentUserProfile());
    }
    
    

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendOtp(@RequestBody ResendOtpRequest request) {

        return ResponseEntity.ok(
                authService.resendVerificationOtp(request.getEmail())
        );
    }
    
    @PostMapping("/sso")
    public ResponseEntity<AuthResponse> ssoLogin(
            @RequestBody SsoLoginRequest request
    ) {

        AuthResponse response = authProviderService.authenticate(request);

        return ResponseEntity.ok(response);
    }


}
