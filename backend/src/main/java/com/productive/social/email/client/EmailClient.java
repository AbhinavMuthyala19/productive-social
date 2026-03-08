package com.productive.social.email.client;

import com.productive.social.email.model.EmailMessage;

/**
 * EmailClient defines the contract for sending emails.
 * 
 * Any implementation (SMTP, SES, SendGrid, etc.) must implement this interface.
 * This keeps the application decoupled from the actual email provider.
 */
public interface EmailClient {

    /**
     * Sends an email using the underlying provider.
     *
     * @param emailMessage the email payload containing recipient, subject, and body
     */
    void sendEmail(EmailMessage emailMessage);
}