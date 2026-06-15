package com.you.lld.problems.featureflags.model;

import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Feature {
    private final String id;
    private final String name;
    private boolean enabled;
    private int rolloutPercentage;
    private final List<TargetingRule> targetingRules;

    public Feature(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
        this.rolloutPercentage = 100;
        this.targetingRules = new ArrayList<TargetingRule>();
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    public void setRolloutPercentage(int percentage) {
        this.rolloutPercentage = percentage;
    }

    public void addTargetingRule(TargetingRule rule) {
        targetingRules.add(rule);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getRolloutPercentage() {
        return rolloutPercentage;
    }

    public List<TargetingRule> getTargetingRules() {
        return Collections.unmodifiableList(targetingRules);
    }

    @Override
    public String toString() {
        return name + " (enabled=" + enabled + ", rollout=" + rolloutPercentage + "%)";
    }
}
