package com.productive.social.notification.listener;

import com.productive.social.email.model.EmailMessage;
import com.productive.social.email.template.EmailTemplateRenderer;
import com.productive.social.notification.EmailNotificationService;
import com.productive.social.notification.event.UserVerificationEmailEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Listens for UserVerificationEmailEvent and sends a verification email.
 */
@Component
@RequiredArgsConstructor
public class UserVerificationEmailListener {

    private final EmailNotificationService emailNotificationService;
    private final EmailTemplateRenderer templateRenderer;

    @EventListener
    public void handleUserVerificationEmailEvent(UserVerificationEmailEvent event) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", event.getName());
        variables.put("otp", event.getOtp());

        String body = templateRenderer.render("verify-email", variables);

        EmailMessage message = new EmailMessage(
                event.getEmail(),
                "Verify your email",
                body,
                true
        );

        emailNotificationService.sendEmail(message);
    }
}