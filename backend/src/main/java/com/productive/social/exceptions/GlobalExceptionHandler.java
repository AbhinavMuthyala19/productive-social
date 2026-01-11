package com.productive.social.exceptions;

import com.productive.social.dto.exceptions.ErrorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage(), ex);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage(), ex);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", ex.getMessage(), ex);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "FORBIDDEN", ex.getMessage(), ex);
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<ErrorResponse> handleInternal(InternalServerException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", ex.getMessage(), ex);
    }


    // Fallback for any unhandled exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Something went wrong",
                ex
        );
    }

    //––––––––––––––––––––––––––––––––––––––––––––––
    // SHARED BUILDER LOGIC
    //––––––––––––––––––––––––––––––––––––––––––––––
    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status,
            String defaultCode,
            String message,
            Exception ex
    ) {

        String code = defaultCode;

        // Check if this exception class has getErrorCode()
        try {
            var method = ex.getClass().getMethod("getErrorCode");
            Object value = method.invoke(ex);
            if (value != null) code = value.toString();
        } catch (Exception ignored) {
            // ignore — fallback to defaultCode
        }

        ErrorResponse error = new ErrorResponse(
                status.value(),
                code,
                message,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, status);
    }
}
