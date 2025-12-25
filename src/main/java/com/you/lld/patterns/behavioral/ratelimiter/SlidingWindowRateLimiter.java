package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Sliding Window Counter rate limiter implementation.
 * 
 * <p>Uses a weighted average of current and previous window counts
 * to provide smoother rate limiting than fixed windows.
 * 
 * <h3>How it works:</h3>
 * <ul>
 *   <li>Divides time into fixed windows</li>
 *   <li>Counts requests in current and previous windows</li>
 *   <li>Calculates weighted count based on position in current window</li>
 *   <li>Rejects if weighted count exceeds limit</li>
 * </ul>
 * 
 * <h3>Example:</h3>
 * <pre>{@code
 * // 100 requests per minute
 * RateLimiter limiter = new SlidingWindowRateLimiter(100, Duration.ofMinutes(1));
 * 
 * if (limiter.tryAcquire()) {
 *     // Process request
 * }
 * }</pre>
 * 
 * <p>More accurate than fixed window at boundaries, more memory efficient
 * than sliding window log.
 */
public class SlidingWindowRateLimiter implements RateLimiter {
    
    private final int maxRequests;
    private final long windowSizeMillis;
    
    private final Lock lock = new ReentrantLock();
    
    private long currentWindowStart;
    private long previousWindowCount;
    private long currentWindowCount;
    
    /**
     * Creates a new Sliding Window rate limiter.
     * 
     * @param maxRequests Maximum requests allowed per window
     * @param windowSize Size of the time window
     */
    public SlidingWindowRateLimiter(int maxRequests, Duration windowSize) {
        if (maxRequests <= 0) {
            throw new IllegalArgumentException("Max requests must be positive");
        }
        if (windowSize.isNegative() || windowSize.isZero()) {
            throw new IllegalArgumentException("Window size must be positive");
        }
        
        this.maxRequests = maxRequests;
        this.windowSizeMillis = windowSize.toMillis();
        this.currentWindowStart = getCurrentWindowStart();
        this.previousWindowCount = 0;
        this.currentWindowCount = 0;
    }
    
    @Override
    public boolean tryAcquire() {
        return tryAcquire(1);
    }
    
    @Override
    public boolean tryAcquire(int permits) {
        lock.lock();
        try {
            slideWindow();
            
            double weightedCount = getWeightedCount();
            
            if (weightedCount + permits <= maxRequests) {
                currentWindowCount += permits;
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public void acquire() throws InterruptedException {
        while (true) {
            if (tryAcquire()) {
                return;
            }
            
            // Wait until some requests should have "expired"
            long waitTime = estimateWaitTime();
            if (waitTime > 0) {
                Thread.sleep(waitTime);
            }
        }
    }
    
    @Override
    public boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException {
        long deadlineMillis = System.currentTimeMillis() + unit.toMillis(timeout);
        
        while (true) {
            if (tryAcquire()) {
                return true;
            }
            
            long remainingMillis = deadlineMillis - System.currentTimeMillis();
            if (remainingMillis <= 0) {
                return false;
            }
            
            long waitTime = Math.min(remainingMillis, estimateWaitTime());
            if (waitTime > 0) {
                Thread.sleep(waitTime);
            }
        }
    }
    
    @Override
    public RateLimitInfo getInfo() {
        lock.lock();
        try {
            slideWindow();
            int weightedCount = (int) getWeightedCount();
            return new RateLimitInfo(
                Math.max(0, maxRequests - weightedCount),
                maxRequests,
                currentWindowStart + windowSizeMillis
            );
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Returns the current request count in the sliding window.
     */
    public long getRequestCount() {
        lock.lock();
        try {
            slideWindow();
            return (long) getWeightedCount();
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Slides the window forward if needed.
     */
    private void slideWindow() {
        long now = System.currentTimeMillis();
        long windowStart = getCurrentWindowStart();
        
        if (windowStart > currentWindowStart) {
            // Check if we've moved more than one window
            if (windowStart - currentWindowStart >= windowSizeMillis) {
                // Previous window is too old
                previousWindowCount = 0;
                currentWindowCount = 0;
            } else {
                // Slide window
                previousWindowCount = currentWindowCount;
                currentWindowCount = 0;
            }
            currentWindowStart = windowStart;
        }
    }
    
    /**
     * Calculates the weighted request count.
     * 
     * Formula: prevCount * (1 - position) + currentCount
     * where position is [0, 1) within current window.
     */
    private double getWeightedCount() {
        long now = System.currentTimeMillis();
        long elapsedInWindow = now - currentWindowStart;
        double position = (double) elapsedInWindow / windowSizeMillis;
        
        // Weight previous window by remaining time
        double previousWeight = 1.0 - position;
        
        return previousWindowCount * previousWeight + currentWindowCount;
    }
    
    /**
     * Estimates wait time until a permit might be available.
     */
    private long estimateWaitTime() {
        double weightedCount = getWeightedCount();
        if (weightedCount < maxRequests) {
            return 0;
        }
        
        // Estimate when previous window weight will decrease enough
        double excess = weightedCount - maxRequests + 1;
        if (previousWindowCount > 0) {
            double waitFraction = excess / previousWindowCount;
            return (long) (waitFraction * windowSizeMillis) + 1;
        }
        
        // No previous count - wait for next window
        return windowSizeMillis - (System.currentTimeMillis() - currentWindowStart);
    }
    
    /**
     * Gets the start time of the current window.
     */
    private long getCurrentWindowStart() {
        long now = System.currentTimeMillis();
        return now - (now % windowSizeMillis);
    }
}
