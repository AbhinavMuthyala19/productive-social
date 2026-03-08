package com.productive.social.email.client;

import com.productive.social.email.config.EmailProperties;
import com.productive.social.email.exception.EmailDeliveryException;
import com.productive.social.email.model.EmailMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * SMTP implementation of EmailClient.
 * Uses Spring's JavaMailSender to send emails.
 */
@Component
@RequiredArgsConstructor
public class SmtpEmailClient implements EmailClient {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailClient.class);

    private final JavaMailSender mailSender;
    private final EmailProperties emailProperties;

    @Override
    public void sendEmail(EmailMessage emailMessage) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, emailMessage.isHtml(), "UTF-8");

            helper.setTo(emailMessage.getTo());
            helper.setSubject(emailMessage.getSubject());
            helper.setText(emailMessage.getBody(), emailMessage.isHtml());
            helper.setFrom(emailProperties.getFromAddress());

            mailSender.send(mimeMessage);

            log.info("Email sent successfully to {}", emailMessage.getTo());

        } catch (MessagingException e) {
            log.error("Failed to send email to {}", emailMessage.getTo(), e);
            throw new EmailDeliveryException("Failed to send email", e);
        }
    }
}