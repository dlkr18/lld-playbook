package com.you.lld.problems.ratelimiter.model;

public class RateLimitConfig {
    private final int maxRequests;
    private final long timeWindowMillis;
    
    public RateLimitConfig(int maxRequests, long timeWindowMillis) {
        this.maxRequests = maxRequests;
        this.timeWindowMillis = timeWindowMillis;
    }
    
    public int getMaxRequests() { return maxRequests; }
    public long getTimeWindowMillis() { return timeWindowMillis; }
    
    @Override
    public String toString() {
        return "RateLimitConfig{maxRequests=" + maxRequests + 
               ", timeWindow=" + timeWindowMillis + "ms}";
    }
}
