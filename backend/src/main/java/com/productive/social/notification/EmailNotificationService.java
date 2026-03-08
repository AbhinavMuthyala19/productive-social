package com.productive.social.notification;

import com.productive.social.email.client.EmailClient;
import com.productive.social.email.model.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Acts as a bridge between application services and the email infrastructure.
 * 
 * This class exposes simple methods to send emails without exposing
 * infrastructure details like SMTP or templates.
 */
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final EmailClient emailClient;

    /**
     * Sends an email using the configured email client.
     *
     * @param emailMessage the email payload
     */
    public void sendEmail(EmailMessage emailMessage) {
        emailClient.sendEmail(emailMessage);
    }
}