package com.productive.social.email.template;

import java.util.Map;

/**
 * Contract for rendering email templates.
 * Converts a template name + variables into a final HTML string.
 */
public interface EmailTemplateRenderer {

    /**
     * Renders a template with the provided variables.
     *
     * @param templateName name of the template file (without extension)
     * @param variables key-value pairs used inside the template
     * @return rendered HTML content
     */
    String render(String templateName, Map<String, Object> variables);
}