package com.you.lld.problems.ratelimiter.model;

public class RateLimitResult {
    private final boolean allowed;
    private final long retryAfterMillis;
    private final int remainingRequests;
    
    public RateLimitResult(boolean allowed, long retryAfterMillis, int remainingRequests) {
        this.allowed = allowed;
        this.retryAfterMillis = retryAfterMillis;
        this.remainingRequests = remainingRequests;
    }
    
    public static RateLimitResult allowed(int remaining) {
        return new RateLimitResult(true, 0, remaining);
    }
    
    public static RateLimitResult blocked(long retryAfter) {
        return new RateLimitResult(false, retryAfter, 0);
    }
    
    public boolean isAllowed() { return allowed; }
    public long getRetryAfterMillis() { return retryAfterMillis; }
    public int getRemainingRequests() { return remainingRequests; }
    
    @Override
    public String toString() {
        return allowed ? 
            "ALLOWED (remaining: " + remainingRequests + ")" :
            "BLOCKED (retry after: " + retryAfterMillis + "ms)";
    }
}
