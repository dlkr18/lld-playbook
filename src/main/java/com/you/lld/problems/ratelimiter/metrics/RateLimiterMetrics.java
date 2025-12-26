package com.you.lld.problems.ratelimiter.metrics;

public class RateLimiterMetrics {
    private long totalRequests;
    private long blockedRequests;
    
    public void recordRequest(boolean allowed) {
        totalRequests++;
        if (!allowed) {
            blockedRequests++;
        }
    }
    
    public long getTotalRequests() {
        return totalRequests;
    }
    
    public long getBlockedRequests() {
        return blockedRequests;
    }
    
    public double getBlockRate() {
        return totalRequests == 0 ? 0 : (double) blockedRequests / totalRequests;
    }
}
