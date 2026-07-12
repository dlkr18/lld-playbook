package com.you.lld.problems.notification.service.impl;

import java.util.HashMap;
import java.util.Map;

public class NotificationTemplateRegistry {

    private final Map<String, String> templates = new HashMap<>();

    public NotificationTemplateRegistry() {
        templates.put("order-shipped", "Hi {{name}}, your order {{orderId}} has shipped!");
        templates.put("security-alert", "URGENT: {{event}} detected on account {{accountId}}.");
        templates.put("welcome", "Welcome {{name}}! Start exploring the platform.");
    }

    public void register(String id, String template) {
        templates.put(id, template);
    }

    public String render(String templateId, Map<String, String> variables) {
        String template = templates.get(templateId);
        if (template == null) {
            throw new IllegalArgumentException("Unknown template: " + templateId);
        }
        String result = template;
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
        }
        return result;
    }
}
