package com.productive.social.security;

import com.productive.social.util.CookieUtil;
import com.productive.social.security.CustomUserDetailsService;
import com.productive.social.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip authentication routes
    	String path = request.getServletPath();

    	if (
    	    path.equals("/auth/login") ||
    	    path.equals("/auth/register") ||
    	    path.equals("/auth/refresh") ||
    	    path.equals("/auth/logout")
    	) {
    	    filterChain.doFilter(request, response);
    	    return;
    	}

        var accessTokenOpt = CookieUtil.getCookieValue(request, CookieUtil.ACCESS_TOKEN_COOKIE);
        var refreshTokenOpt = CookieUtil.getCookieValue(request, CookieUtil.REFRESH_TOKEN_COOKIE);

        // If either cookie missing → force unauthorized
        if (accessTokenOpt.isEmpty() || refreshTokenOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String jwt = accessTokenOpt.get();
        String username;

        try {
            username = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Authenticate only if user not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            var userDetails = customUserDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                // Token present but invalid/expired
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }


}
