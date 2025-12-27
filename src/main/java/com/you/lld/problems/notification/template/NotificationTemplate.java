package com.you.lld.problems.notification.template;

import java.util.Map;

public class NotificationTemplate {
    private final String id;
    private final String name;
    private final String template;
    
    public NotificationTemplate(String id, String name, String template) {
        this.id = id;
        this.name = name;
        this.template = template;
    }
    
    public String render(Map<String, String> variables) {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
}
