package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Token Bucket rate limiter implementation.
 * 
 * <p>The token bucket algorithm allows burst traffic up to the bucket capacity,
 * while maintaining a long-term average rate.
 * 
 * <h3>How it works:</h3>
 * <ul>
 *   <li>Bucket starts full with {@code capacity} tokens</li>
 *   <li>Tokens are added at rate {@code refillTokens/refillPeriod}</li>
 *   <li>Each request consumes one token</li>
 *   <li>Requests are rejected if no tokens available</li>
 * </ul>
 * 
 * <h3>Example:</h3>
 * <pre>{@code
 * // Allow 100 requests/minute with burst of 10
 * RateLimiter limiter = new TokenBucketRateLimiter(10, 100, Duration.ofMinutes(1));
 * 
 * if (limiter.tryAcquire()) {
 *     // Process request
 * } else {
 *     // Rate limited - return 429
 * }
 * }</pre>
 * 
 * <p>Thread-safe.
 */
public class TokenBucketRateLimiter implements RateLimiter {
    
    private final int capacity;
    private final int refillTokens;
    private final long refillPeriodNanos;
    
    private double availableTokens;
    private long lastRefillTime;
    
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition tokensAvailable = lock.newCondition();
    
    /**
     * Creates a new Token Bucket rate limiter.
     * 
     * @param capacity Maximum number of tokens (burst size)
     * @param refillTokens Tokens to add per refill period
     * @param refillPeriod How often to add tokens
     */
    public TokenBucketRateLimiter(int capacity, int refillTokens, Duration refillPeriod) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        if (refillTokens <= 0) {
            throw new IllegalArgumentException("Refill tokens must be positive");
        }
        if (refillPeriod.isNegative() || refillPeriod.isZero()) {
            throw new IllegalArgumentException("Refill period must be positive");
        }
        
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillPeriodNanos = refillPeriod.toNanos();
        this.availableTokens = capacity;
        this.lastRefillTime = System.nanoTime();
    }
    
    /**
     * Convenience constructor for simple rate limiting.
     * 
     * @param requestsPerSecond Maximum average rate
     */
    public static TokenBucketRateLimiter perSecond(int requestsPerSecond) {
        return new TokenBucketRateLimiter(
            Math.max(1, requestsPerSecond / 10),  // 10% burst
            requestsPerSecond,
            Duration.ofSeconds(1)
        );
    }
    
    @Override
    public boolean tryAcquire() {
        return tryAcquire(1);
    }
    
    @Override
    public boolean tryAcquire(int permits) {
        if (permits <= 0) {
            throw new IllegalArgumentException("Permits must be positive");
        }
        
        lock.lock();
        try {
            refill();
            
            if (availableTokens >= permits) {
                availableTokens -= permits;
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public void acquire() throws InterruptedException {
        lock.lockInterruptibly();
        try {
            while (true) {
                refill();
                
                if (availableTokens >= 1) {
                    availableTokens -= 1;
                    return;
                }
                
                // Wait for next refill
                long waitNanos = calculateWaitTime(1);
                tokensAvailable.awaitNanos(waitNanos);
            }
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException {
        long deadlineNanos = System.nanoTime() + unit.toNanos(timeout);
        
        lock.lockInterruptibly();
        try {
            while (true) {
                refill();
                
                if (availableTokens >= 1) {
                    availableTokens -= 1;
                    return true;
                }
                
                long remainingNanos = deadlineNanos - System.nanoTime();
                if (remainingNanos <= 0) {
                    return false;
                }
                
                long waitNanos = Math.min(remainingNanos, calculateWaitTime(1));
                tokensAvailable.awaitNanos(waitNanos);
            }
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public RateLimitInfo getInfo() {
        lock.lock();
        try {
            refill();
            long resetTime = lastRefillTime + refillPeriodNanos;
            return new RateLimitInfo(
                (int) availableTokens,
                capacity,
                resetTime / 1_000_000 // Convert to millis
            );
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Refills tokens based on elapsed time.
     * Must be called while holding the lock.
     */
    private void refill() {
        long now = System.nanoTime();
        long elapsed = now - lastRefillTime;
        
        if (elapsed > 0) {
            // Calculate tokens to add based on elapsed time
            double tokensToAdd = (double) elapsed / refillPeriodNanos * refillTokens;
            availableTokens = Math.min(capacity, availableTokens + tokensToAdd);
            lastRefillTime = now;
            
            if (availableTokens >= 1) {
                tokensAvailable.signalAll();
            }
        }
    }
    
    /**
     * Calculates wait time for the requested number of tokens.
     */
    private long calculateWaitTime(int permits) {
        double tokensNeeded = permits - availableTokens;
        if (tokensNeeded <= 0) {
            return 0;
        }
        return (long) (tokensNeeded / refillTokens * refillPeriodNanos);
    }
    
    /**
     * Returns current available tokens (for testing).
     */
    int getAvailableTokens() {
        lock.lock();
        try {
            refill();
            return (int) availableTokens;
        } finally {
            lock.unlock();
        }
    }
}
