package com.you.lld.problems.featureflags.model;

import java.util.*;

public class Feature {
    private final String id;
    private final String name;
    private boolean enabled;
    private final Map<String, RolloutStrategy> strategies;
    
    public Feature(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
        this.strategies = new HashMap<>();
    }
    
    public void enable() { this.enabled = true; }
    public void disable() { this.enabled = false; }
    
    public void addStrategy(String key, RolloutStrategy strategy) {
        strategies.put(key, strategy);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public boolean isEnabled() { return enabled; }
    public Map<String, RolloutStrategy> getStrategies() { return strategies; }
    
    @Override
    public String toString() {
        return name + " (enabled=" + enabled + ")";
    }
}
