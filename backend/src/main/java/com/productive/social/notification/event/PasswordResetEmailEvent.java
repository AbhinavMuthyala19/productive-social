package com.productive.social.notification.event;

/**
 * Event published when a password reset email needs to be sent.
 */
public class PasswordResetEmailEvent {

    private final String email;
    private final String name;
    private final String resetLink;

    public PasswordResetEmailEvent(String email, String name, String resetLink) {
        this.email = email;
        this.name = name;
        this.resetLink = resetLink;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getResetLink() {
        return resetLink;
    }
}