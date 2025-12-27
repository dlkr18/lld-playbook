package com.you.lld.problems.featureflags.model;

import java.time.LocalDateTime;

public class FeatureToggle {
    private final String id;
    private final String name;
    private boolean enabled;
    private LocalDateTime enabledAt;
    private LocalDateTime disabledAt;
    
    public FeatureToggle(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
    }
    
    public void enable() {
        this.enabled = true;
        this.enabledAt = LocalDateTime.now();
    }
    
    public void disable() {
        this.enabled = false;
        this.disabledAt = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public boolean isEnabled() { return enabled; }
}
