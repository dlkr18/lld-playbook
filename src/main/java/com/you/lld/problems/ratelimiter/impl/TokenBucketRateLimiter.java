package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.*;
import java.util.concurrent.*;

/**
 * Token Bucket Rate Limiter
 * 
 * Algorithm:
 * - Bucket holds tokens (up to capacity)
 * - Tokens refill at a constant rate
 * - Each request consumes 1 token
 * - Request allowed only if token available
 * 
 * Pros:
 * - Handles bursts (bucket capacity)
 * - Smooth refill rate
 * - Memory efficient
 * 
 * Cons:
 * - Slightly complex implementation
 */
public class TokenBucketRateLimiter implements RateLimiter {
    
    private final ConcurrentHashMap<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    private final int capacity;
    private final int refillRate; // tokens per second
    private final ScheduledExecutorService refillScheduler;
    
    public TokenBucketRateLimiter(int capacity, int refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.refillScheduler = Executors.newScheduledThreadPool(1);
        
        // Refill tokens every 100ms
        refillScheduler.scheduleAtFixedRate(
            this::refillAllBuckets, 
            100, 100, TimeUnit.MILLISECONDS
        );
    }
    
    @Override
    public RateLimitResult allowRequest(String clientId) {
        TokenBucket bucket = buckets.computeIfAbsent(
            clientId, 
            k -> new TokenBucket(capacity)
        );
        
        return bucket.tryConsume() ? 
            RateLimitResult.allowed(bucket.getTokens()) :
            RateLimitResult.blocked(calculateRetryAfter());
    }
    
    @Override
    public void resetLimit(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        if (bucket != null) {
            bucket.refill(capacity);
        }
    }
    
    @Override
    public int getRemainingRequests(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        return bucket != null ? bucket.getTokens() : capacity;
    }
    
    private void refillAllBuckets() {
        int tokensToAdd = refillRate / 10; // Per 100ms
        for (TokenBucket bucket : buckets.values()) {
            bucket.refill(Math.min(tokensToAdd, capacity - bucket.getTokens()));
        }
    }
    
    private long calculateRetryAfter() {
        return 1000 / refillRate; // Approximate
    }
    
    public void shutdown() {
        refillScheduler.shutdown();
    }
    
    private static class TokenBucket {
        private int tokens;
        
        TokenBucket(int initialTokens) {
            this.tokens = initialTokens;
        }
        
        synchronized boolean tryConsume() {
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }
        
        synchronized void refill(int count) {
            tokens += count;
        }
        
        synchronized int getTokens() {
            return tokens;
        }
    }
}
