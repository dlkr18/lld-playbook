package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.RateLimitResult;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Leaky bucket: requests drain at a constant rate; smooths bursts.
 */
public class LeakyBucketRateLimiter implements RateLimiter {
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<String, Bucket>();
    private final int capacity;
    private final double leakRatePerMs;

    public LeakyBucketRateLimiter(int capacity, double leakRatePerSecond) {
        this.capacity = capacity;
        this.leakRatePerMs = leakRatePerSecond / 1000.0;
    }

    @Override
    public RateLimitResult allowRequest(String clientId) {
        Bucket bucket = buckets.computeIfAbsent(clientId, new java.util.function.Function<String, Bucket>() {
            @Override
            public Bucket apply(String k) {
                return new Bucket();
            }
        });
        synchronized (bucket) {
            bucket.leak();
            if (bucket.level < capacity) {
                bucket.level++;
                return RateLimitResult.allowed(capacity - bucket.level);
            }
            int retryMs = (int) Math.ceil(1.0 / leakRatePerMs);
            return RateLimitResult.blocked(retryMs);
        }
    }

    @Override
    public void resetLimit(String clientId) {
        Bucket bucket = buckets.get(clientId);
        if (bucket != null) {
            synchronized (bucket) {
                bucket.level = 0;
            }
        }
    }

    @Override
    public int getRemainingRequests(String clientId) {
        Bucket bucket = buckets.get(clientId);
        if (bucket == null) {
            return capacity;
        }
        synchronized (bucket) {
            bucket.leak();
            return Math.max(0, capacity - bucket.level);
        }
    }

    private final class Bucket {
        private int level;
        private long lastLeakMillis = System.currentTimeMillis();

        void leak() {
            long now = System.currentTimeMillis();
            long elapsed = now - lastLeakMillis;
            if (elapsed <= 0) {
                return;
            }
            int leaked = (int) (elapsed * leakRatePerMs);
            if (leaked > 0) {
                level = Math.max(0, level - leaked);
                lastLeakMillis = now;
            }
        }
    }
}
