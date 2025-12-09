package com.productive.social.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;


import java.util.Arrays;
import java.util.Optional;

public class CookieUtil {

    // Cookie names (use these everywhere to avoid typos)
    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    // Adjust these for prod (e.g. Secure = true on HTTPS)
    private static final boolean SECURE = true;               // set true in production (HTTPS)
    private static final String SAME_SITE = "None";             // or "None" if cross-site // Lax if same-site
    private static final String PATH = "/";                    // cookie available for whole app

    // Example lifetimes (in seconds)
    private static final long ACCESS_TOKEN_MAX_AGE = 15 * 60;      // 15 minutes
    private static final long REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;  // 7 days


    /** Create Set-Cookie header string for access token */
    public static String createAccessTokenCookie(String token) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(SECURE)
                .path(PATH)
                .maxAge(ACCESS_TOKEN_MAX_AGE)
                .sameSite(SAME_SITE)
                .build();
        return cookie.toString();
    }

    /** Create Set-Cookie header string for refresh token */
    public static String createRefreshTokenCookie(String token) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(SECURE)
                .path(PATH)
                .maxAge(REFRESH_TOKEN_MAX_AGE)
                .sameSite(SAME_SITE)
                .build();
        return cookie.toString();
    }

    /** Clear access token cookie (for logout) */
    public static String clearAccessTokenCookie() {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(SECURE)
                .path(PATH)
                .maxAge(0)               // expire immediately
                .sameSite(SAME_SITE)
                .build();
        return cookie.toString();
    }

    /** Clear refresh token cookie (for logout) */
    public static String clearRefreshTokenCookie() {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(SECURE)
                .path(PATH)
                .maxAge(0)
                .sameSite(SAME_SITE)
                .build();
        return cookie.toString();
    }

    /** Helper to read a cookie value by name from the request */
    public static Optional<String> getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
