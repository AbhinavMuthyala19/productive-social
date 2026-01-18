package com.productive.social.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        try {
            // 1. Generate unique request ID
            String requestId = UUID.randomUUID().toString();

            // 2. Put it into MDC context
            MDC.put("requestId", requestId);

            // 3. Continue request
            chain.doFilter(request, response);
        }
        finally {
            // 4. ALWAYS remove MDC value when done
            MDC.clear();
        }
    }
}
