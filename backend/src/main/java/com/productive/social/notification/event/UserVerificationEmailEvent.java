package com.productive.social.notification.event;

/**
 * Event published when a user needs a verification email.
 * Carries the data required to build the email.
 */
public class UserVerificationEmailEvent {

    private final String email;
    private final String name;
    private final String otp;

    public UserVerificationEmailEvent(String email, String name, String otp) {
        this.email = email;
        this.name = name;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getOtp() {
        return otp;
    }
}