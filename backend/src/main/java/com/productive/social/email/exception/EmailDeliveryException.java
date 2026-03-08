package com.productive.social.email.exception;

/**
 * Custom exception thrown when an email fails to send.
 * This helps isolate email-related errors from business logic.
 */
public class EmailDeliveryException extends RuntimeException {

    public EmailDeliveryException(String message) {
        super(message);
    }

    public EmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}