package com.you.lld.problems.ratelimiter.api;

import com.you.lld.problems.ratelimiter.model.RateLimitResult;

public interface RateLimiter {
    RateLimitResult allowRequest(String clientId);
    void resetLimit(String clientId);
    int getRemainingRequests(String clientId);
}
