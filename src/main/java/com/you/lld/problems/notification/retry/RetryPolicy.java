package com.you.lld.problems.notification.retry;

public class RetryPolicy {
    private final int maxRetries;
    private final long retryDelayMs;
    
    public RetryPolicy(int maxRetries, long retryDelayMs) {
        this.maxRetries = maxRetries;
        this.retryDelayMs = retryDelayMs;
    }
    
    public int getMaxRetries() { return maxRetries; }
    public long getRetryDelayMs() { return retryDelayMs; }
    
    public long getDelayForAttempt(int attempt) {
        return retryDelayMs * (1L << attempt);
    }
}
