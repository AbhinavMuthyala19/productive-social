package com.productive.social.email.template;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

/**
 * Thymeleaf implementation of EmailTemplateRenderer.
 * Uses Thymeleaf to process HTML templates.
 */
@Component
@RequiredArgsConstructor
public class ThymeleafEmailTemplateRenderer implements EmailTemplateRenderer {

    private final TemplateEngine templateEngine;

    @Override
    public String render(String templateName, Map<String, Object> variables) {

        Context context = new Context();
        if (variables != null) {
            context.setVariables(variables);
        }

        return templateEngine.process("email/" + templateName, context);
    }
}