package com.you.lld.problems.ratelimiter;

import com.you.lld.problems.ratelimiter.impl.TokenBucketRateLimiter;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenBucketRefillTest {

    @Test
    void refillsAtRatesBelowTenPerSecond() throws Exception {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(1, 5); // 5 tokens/s
        assertTrue(limiter.allowRequest("c").isAllowed());
        assertFalse(limiter.allowRequest("c").isAllowed());
        Thread.sleep(500); // ~2.5 tokens' worth of time
        assertTrue(limiter.allowRequest("c").isAllowed());
    }
}
