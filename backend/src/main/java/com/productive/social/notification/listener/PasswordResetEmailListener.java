package com.productive.social.notification.listener;

import com.productive.social.email.model.EmailMessage;
import com.productive.social.email.template.EmailTemplateRenderer;
import com.productive.social.notification.EmailNotificationService;
import com.productive.social.notification.event.PasswordResetEmailEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Listens for PasswordResetEmailEvent and sends a reset password email.
 */
@Component
@RequiredArgsConstructor
public class PasswordResetEmailListener {

    private final EmailNotificationService emailNotificationService;
    private final EmailTemplateRenderer templateRenderer;

    @EventListener
    public void handlePasswordResetEmailEvent(PasswordResetEmailEvent event) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", event.getName());
        variables.put("resetLink", event.getResetLink());

        String body = templateRenderer.render("reset-password", variables);

        EmailMessage message = new EmailMessage(
                event.getEmail(),
                "Reset your password",
                body,
                true
        );

        emailNotificationService.sendEmail(message);
    }
}