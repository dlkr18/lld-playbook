package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.RateLimitAlgorithm;

public final class RateLimiterFactory {
    private RateLimiterFactory() {}

    public static RateLimiter create(RateLimitAlgorithm algorithm, int maxRequests, long windowOrCapacity,
                                     double refillPerSecond) {
        switch (algorithm) {
            case TOKEN_BUCKET:
                return new TokenBucketRateLimiter((int) windowOrCapacity, (int) refillPerSecond);
            case SLIDING_WINDOW:
                return new SlidingWindowRateLimiter(maxRequests, windowOrCapacity);
            case FIXED_WINDOW:
                return new FixedWindowRateLimiter(maxRequests, windowOrCapacity);
            case LEAKY_BUCKET:
                return new LeakyBucketRateLimiter((int) windowOrCapacity, refillPerSecond);
            default:
                throw new IllegalArgumentException("Unknown algorithm: " + algorithm);
        }
    }
}
