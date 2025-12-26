package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.*;
import java.util.concurrent.*;
import java.util.*;

/**
 * Sliding Window Rate Limiter
 * 
 * Algorithm:
 * - Tracks timestamps of all requests in a window
 * - Slides window forward with time
 * - Counts requests in current window
 * 
 * Pros:
 * - Most accurate
 * - No burst issues
 * 
 * Cons:
 * - Memory intensive (stores all timestamps)
 */
public class SlidingWindowRateLimiter implements RateLimiter {
    
    private final ConcurrentHashMap<String, Queue<Long>> requestTimestamps = new ConcurrentHashMap<>();
    private final int maxRequests;
    private final long windowMillis;
    
    public SlidingWindowRateLimiter(int maxRequests, long windowMillis) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowMillis;
    }
    
    @Override
    public RateLimitResult allowRequest(String clientId) {
        long now = System.currentTimeMillis();
        Queue<Long> timestamps = requestTimestamps.computeIfAbsent(
            clientId,
            k -> new ConcurrentLinkedQueue<>()
        );
        
        // Remove old timestamps
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peek() < now - windowMillis) {
                timestamps.poll();
            }
            
            if (timestamps.size() < maxRequests) {
                timestamps.offer(now);
                return RateLimitResult.allowed(maxRequests - timestamps.size());
            } else {
                long oldestTimestamp = timestamps.peek();
                long retryAfter = oldestTimestamp + windowMillis - now;
                return RateLimitResult.blocked(retryAfter);
            }
        }
    }
    
    @Override
    public void resetLimit(String clientId) {
        Queue<Long> timestamps = requestTimestamps.get(clientId);
        if (timestamps != null) {
            timestamps.clear();
        }
    }
    
    @Override
    public int getRemainingRequests(String clientId) {
        long now = System.currentTimeMillis();
        Queue<Long> timestamps = requestTimestamps.get(clientId);
        
        if (timestamps == null) {
            return maxRequests;
        }
        
        synchronized (timestamps) {
            // Remove old
            while (!timestamps.isEmpty() && timestamps.peek() < now - windowMillis) {
                timestamps.poll();
            }
            return maxRequests - timestamps.size();
        }
    }
}
