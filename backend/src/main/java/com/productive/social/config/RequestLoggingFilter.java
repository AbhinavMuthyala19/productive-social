package com.productive.social.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        String requestId = UUID.randomUUID().toString();

        try {
            MDC.put("requestId", requestId);

            HttpServletRequest httpReq = (HttpServletRequest) request;

            // Extract user info
            String userInfo = "anonymous";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                userInfo = principal.toString(); // e.g., CustomUserDetails(username)
            }

            // Log BEFORE request hits controller
            log.info("Incoming Request - user={}, {} {}", 
                    userInfo,
                    httpReq.getMethod(),
                    httpReq.getRequestURI());

            chain.doFilter(request, response);

            // Optionally log after returning
            log.info("Completed Request - {}", httpReq.getRequestURI());

        } finally {
            MDC.clear();
        }
    }
}
