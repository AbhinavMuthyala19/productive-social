package com.productive.social.email.model;

import java.util.Map;

/**
 * Represents a generic email payload used by the email module.
 * This class contains all the data required to send an email,
 * independent of any email provider (SMTP, SES, etc.).
 */
public class EmailMessage {

    private String to;
    private String subject;
    private String body;
    private boolean html;

    // Optional metadata for future extensibility (tracking, tags, etc.)
    private Map<String, Object> metadata;

    public EmailMessage() {
    }

    public EmailMessage(String to, String subject, String body, boolean html) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.html = html;
    }

    public EmailMessage(String to, String subject, String body, boolean html, Map<String, Object> metadata) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.html = html;
        this.metadata = metadata;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isHtml() {
        return html;
    }

    public void setHtml(boolean html) {
        this.html = html;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}