package com.productive.social.email.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Holds configuration related to email sending.
 * Values are loaded from application.yml or application.properties.
 */
@Component
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {

    /**
     * SMTP host (e.g., smtp.gmail.com)
     */
    private String host;

    /**
     * SMTP port (e.g., 587)
     */
    private int port;

    /**
     * SMTP username (email address)
     */
    private String username;

    /**
     * SMTP password or app password
     */
    private String password;

    /**
     * Default "from" email address
     */
    private String fromAddress;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        this.fromAddress = fromAddress;
    }
}