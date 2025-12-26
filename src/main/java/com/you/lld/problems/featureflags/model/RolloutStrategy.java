package com.you.lld.problems.featureflags.model;

public class RolloutStrategy {
    private final String type;
    private final int percentage;
    private final String targetGroup;
    
    public RolloutStrategy(String type, int percentage, String targetGroup) {
        this.type = type;
        this.percentage = percentage;
        this.targetGroup = targetGroup;
    }
    
    public String getType() { return type; }
    public int getPercentage() { return percentage; }
    public String getTargetGroup() { return targetGroup; }
}
