package com.you.lld.problems.ratelimiter;

import com.you.lld.problems.ratelimiter.impl.FixedWindowRateLimiter;
import com.you.lld.problems.ratelimiter.impl.LeakyBucketRateLimiter;
import com.you.lld.problems.ratelimiter.impl.SlidingWindowRateLimiter;
import com.you.lld.problems.ratelimiter.impl.TokenBucketRateLimiter;
import com.you.lld.problems.ratelimiter.model.RateLimitAlgorithm;
import com.you.lld.problems.ratelimiter.model.RateLimitResult;

public class RateLimiterDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Rate Limiter Demo ===\n");
        demoTokenBucket();
        demoSlidingWindow();
        demoFixedWindow();
        demoLeakyBucket();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoTokenBucket() throws InterruptedException {
        System.out.println("--- 1. Token Bucket (capacity=5, refill=10/sec) ---");
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 10);
        for (int i = 1; i <= 7; i++) {
            RateLimitResult r = limiter.allowRequest("user1");
            System.out.println("  req " + i + ": " + r);
        }
        Thread.sleep(500);
        System.out.println("  after 500ms refill: " + limiter.allowRequest("user1"));
        limiter.shutdown();
    }

    private static void demoSlidingWindow() throws InterruptedException {
        System.out.println("\n--- 2. Sliding Window (max=3, window=1000ms) ---");
        SlidingWindowRateLimiter limiter = new SlidingWindowRateLimiter(3, 1000);
        for (int i = 1; i <= 5; i++) {
            System.out.println("  req " + i + ": " + limiter.allowRequest("c1"));
        }
        Thread.sleep(1100);
        System.out.println("  after window slide: " + limiter.allowRequest("c1"));
    }

    private static void demoFixedWindow() {
        System.out.println("\n--- 3. Fixed Window (max=3, window=1000ms) ---");
        FixedWindowRateLimiter limiter = new FixedWindowRateLimiter(3, 1000);
        for (int i = 1; i <= 5; i++) {
            System.out.println("  req " + i + ": " + limiter.allowRequest("api"));
        }
    }

    private static void demoLeakyBucket() throws InterruptedException {
        System.out.println("\n--- 4. Leaky Bucket (capacity=3, leak=2/sec) ---");
        LeakyBucketRateLimiter limiter = new LeakyBucketRateLimiter(3, 2.0);
        for (int i = 1; i <= 5; i++) {
            System.out.println("  req " + i + ": " + limiter.allowRequest("svc"));
        }
        Thread.sleep(600);
        System.out.println("  after leak: " + limiter.allowRequest("svc"));
    }
}
