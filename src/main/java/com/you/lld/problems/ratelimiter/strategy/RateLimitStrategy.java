package com.you.lld.problems.ratelimiter.strategy;

public interface RateLimitStrategy {
    boolean allowRequest(String userId);
    void reset(String userId);
}
