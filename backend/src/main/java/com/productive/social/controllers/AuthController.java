package com.productive.social.controllers;

import com.productive.social.dto.auth.AuthResponse;
import com.productive.social.dto.auth.LoginRequest;
import com.productive.social.dto.auth.RefreshRequest;
import com.productive.social.dto.auth.RegisterRequest;
import com.productive.social.service.AuthService;
import com.productive.social.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//        return ResponseEntity.ok(authService.login(request));
//    }

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



//    @PostMapping("/refresh")
//    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
//        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
//    }

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


//    @PostMapping("/logout")
//    public ResponseEntity<String> logout(@RequestBody RefreshRequest request) {
//        return ResponseEntity.ok(authService.logout(request.getRefreshToken()));
//    }

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


}
