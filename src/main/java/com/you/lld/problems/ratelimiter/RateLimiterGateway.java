package com.you.lld.problems.ratelimiter;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.impl.RateLimiterFactory;
import com.you.lld.problems.ratelimiter.model.RateLimitAlgorithm;
import com.you.lld.problems.ratelimiter.model.RateLimitResult;

/** Facade — swap algorithms via {@link RateLimitAlgorithm}. */
public class RateLimiterGateway {
    private final RateLimiter delegate;

    public RateLimiterGateway(RateLimitAlgorithm algorithm, int maxRequests, long windowMs, double refillPerSec) {
        this.delegate = RateLimiterFactory.create(algorithm, maxRequests, windowMs, refillPerSec);
    }

    public RateLimitResult allow(String clientId) {
        return delegate.allowRequest(clientId);
    }

    public int remaining(String clientId) {
        return delegate.getRemainingRequests(clientId);
    }

    public void reset(String clientId) {
        delegate.resetLimit(clientId);
    }

    public RateLimiter unwrap() {
        return delegate;
    }
}
