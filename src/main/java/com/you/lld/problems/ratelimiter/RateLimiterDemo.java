package com.you.lld.problems.ratelimiter;

import com.you.lld.problems.ratelimiter.impl.TokenBucketRateLimiter;
import com.you.lld.problems.ratelimiter.impl.SlidingWindowRateLimiter;
import com.you.lld.problems.ratelimiter.model.RateLimitResult;

/**
 * Demo: Rate Limiter comparing Token Bucket vs Sliding Window.
 */
public class RateLimiterDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Rate Limiter Demo ===\n");

        demoTokenBucket();
        System.out.println();
        demoSlidingWindow();

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoTokenBucket() throws InterruptedException {
        System.out.println("--- Token Bucket (capacity=5, refill=10/sec) ---");
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 10);

        // Burst: send 7 requests
        System.out.println("Burst of 7 requests:");
        for (int i = 1; i <= 7; i++) {
            RateLimitResult result = limiter.allowRequest("user1");
            System.out.println("  Request " + i + ": " + result);
        }

        // Wait for refill
        System.out.println("Waiting 500ms for refill...");
        Thread.sleep(500);

        System.out.println("After refill:");
        for (int i = 1; i <= 3; i++) {
            RateLimitResult result = limiter.allowRequest("user1");
            System.out.println("  Request " + i + ": " + result);
        }

        // Different clients are independent
        System.out.println("Different client (independent bucket):");
        RateLimitResult user2 = limiter.allowRequest("user2");
        System.out.println("  user2: " + user2);

        // Reset
        limiter.resetLimit("user1");
        System.out.println("After reset: remaining=" + limiter.getRemainingRequests("user1"));

        limiter.shutdown();
    }

    private static void demoSlidingWindow() throws InterruptedException {
        System.out.println("--- Sliding Window (max=3, window=1000ms) ---");
        SlidingWindowRateLimiter limiter = new SlidingWindowRateLimiter(3, 1000);

        // Send requests
        System.out.println("Send 5 requests:");
        for (int i = 1; i <= 5; i++) {
            RateLimitResult result = limiter.allowRequest("client1");
            System.out.println("  Request " + i + ": " + result);
        }

        // Wait for window to slide
        System.out.println("Waiting 1100ms for window to slide...");
        Thread.sleep(1100);

        System.out.println("After window slides:");
        for (int i = 1; i <= 4; i++) {
            RateLimitResult result = limiter.allowRequest("client1");
            System.out.println("  Request " + i + ": " + result);
        }

        // Multi-client
        System.out.println("Remaining for client1: " + limiter.getRemainingRequests("client1"));
        System.out.println("Remaining for newClient: " + limiter.getRemainingRequests("newClient"));
    }
}
