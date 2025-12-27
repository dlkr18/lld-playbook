package com.you.lld.problems.ratelimiter.rules;

public class RateLimitRule {
    private final String name;
    private final int maxRequests;
    private final long windowMs;
    
    public RateLimitRule(String name, int maxRequests, long windowMs) {
        this.name = name;
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    
    public String getName() { return name; }
    public int getMaxRequests() { return maxRequests; }
    public long getWindowMs() { return windowMs; }
}
