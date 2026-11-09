package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Token Bucket Rate Limiter
 * 
 * Algorithm:
 * - Bucket holds tokens (up to capacity)
 * - Tokens refill at a constant rate, computed lazily from elapsed time on
 *   each request (no background thread, works for any rate, even < 10/s)
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
    
    public TokenBucketRateLimiter(int capacity, int refillRate) {
        if (capacity <= 0 || refillRate <= 0) {
            throw new IllegalArgumentException("capacity and refillRate must be positive");
        }
        this.capacity = capacity;
        this.refillRate = refillRate;
    }
    
    @Override
    public RateLimitResult allowRequest(String clientId) {
        TokenBucket bucket = buckets.computeIfAbsent(
            clientId, 
            k -> new TokenBucket(capacity, refillRate)
        );
        return bucket.tryConsume() ? 
            RateLimitResult.allowed(bucket.getTokens()) :
            RateLimitResult.blocked(calculateRetryAfter());
    }
    
    @Override
    public void resetLimit(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        if (bucket != null) {
            bucket.fill();
        }
    }
    
    @Override
    public int getRemainingRequests(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        return bucket != null ? bucket.getTokens() : capacity;
    }
    
    private long calculateRetryAfter() {
        return Math.max(1, 1000 / refillRate); // time for one token, in ms
    }
    
    /**
     * Tokens are a double so slow rates accumulate fractions between requests.
     * Each call first adds (elapsed seconds × rate) tokens, capped at capacity.
     */
    private static class TokenBucket {
        private final int capacity;
        private final double tokensPerNano;
        private double tokens;
        private long lastRefillNanos;
        
        TokenBucket(int capacity, int refillRate) {
            this.capacity = capacity;
            this.tokensPerNano = refillRate / 1_000_000_000.0;
            this.tokens = capacity;
            this.lastRefillNanos = System.nanoTime();
        }
        
        synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1) {
                tokens -= 1;
                return true;
            }
            return false;
        }
        
        synchronized void fill() {
            tokens = capacity;
            lastRefillNanos = System.nanoTime();
        }
        
        synchronized int getTokens() {
            refill();
            return (int) tokens;
        }
        
        private void refill() {
            long now = System.nanoTime();
            tokens = Math.min(capacity, tokens + (now - lastRefillNanos) * tokensPerNano);
            lastRefillNanos = now;
        }
    }
}
