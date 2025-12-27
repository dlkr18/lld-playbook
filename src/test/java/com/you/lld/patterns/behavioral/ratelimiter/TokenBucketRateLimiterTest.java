package com.you.lld.patterns.behavioral.ratelimiter;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.Duration;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for TokenBucketRateLimiter.
 */
class TokenBucketRateLimiterTest {
    
    @Test
    @DisplayName("Should allow requests up to bucket capacity")
    void shouldAllowRequestsUpToCapacity() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(10, 1, Duration.ofSeconds(1));
        
        // Should succeed 10 times
        for (int i = 0; i < 10; i++) {
            assertTrue(limiter.tryAcquire(), "Request " + (i + 1) + " should succeed");
        }
        
        // 11th should fail
        assertFalse(limiter.tryAcquire(), "11th request should fail");
    }
    
    @Test
    @DisplayName("Should refill tokens over time")
    void shouldRefillTokensOverTime() throws InterruptedException {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 5, Duration.ofMillis(100));
        
        // Drain all tokens
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryAcquire());
        }
        assertFalse(limiter.tryAcquire());
        
        // Wait for refill
        Thread.sleep(110);
        
        // Should have tokens again
        assertTrue(limiter.tryAcquire(), "Should have refilled tokens");
    }
    
    @Test
    @DisplayName("Should not exceed capacity during refill")
    void shouldNotExceedCapacityDuringRefill() throws InterruptedException {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 10, Duration.ofMillis(50));
        
        // Wait for multiple refill periods
        Thread.sleep(200);
        
        // Should still only allow up to capacity
        int successes = 0;
        for (int i = 0; i < 10; i++) {
            if (limiter.tryAcquire()) {
                successes++;
            }
        }
        
        assertEquals(5, successes, "Should not exceed capacity");
    }
    
    @Test
    @DisplayName("Should acquire multiple permits at once")
    void shouldAcquireMultiplePermits() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(10, 1, Duration.ofSeconds(1));
        
        assertTrue(limiter.tryAcquire(5), "Should acquire 5 permits");
        assertTrue(limiter.tryAcquire(5), "Should acquire remaining 5 permits");
        assertFalse(limiter.tryAcquire(1), "Should have no permits left");
    }
    
    @Test
    @DisplayName("Should reject if not enough permits available")
    void shouldRejectIfNotEnoughPermits() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 1, Duration.ofSeconds(1));
        
        assertTrue(limiter.tryAcquire(3), "Should acquire 3 permits");
        assertFalse(limiter.tryAcquire(5), "Should reject - only 2 left");
        assertTrue(limiter.tryAcquire(2), "Should acquire remaining 2");
    }
    
    @Test
    @DisplayName("Should block on acquire() until permit available")
    void shouldBlockOnAcquire() throws InterruptedException {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(1, 1, Duration.ofMillis(100));
        
        // Take the only permit
        assertTrue(limiter.tryAcquire());
        
        // acquire() should block until refill
        long startTime = System.currentTimeMillis();
        limiter.acquire();
        long elapsed = System.currentTimeMillis() - startTime;
        
        assertTrue(elapsed >= 90, "Should have blocked for ~100ms");
    }
    
    @Test
    @DisplayName("Should timeout on tryAcquire with timeout")
    void shouldTimeoutOnTryAcquireWithTimeout() throws InterruptedException {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(1, 1, Duration.ofSeconds(10));
        
        assertTrue(limiter.tryAcquire());
        
        // Should timeout
        long start = System.currentTimeMillis();
        boolean result = limiter.tryAcquire(50, TimeUnit.MILLISECONDS);
        long elapsed = System.currentTimeMillis() - start;
        
        assertFalse(result, "Should timeout");
        assertTrue(elapsed >= 50 && elapsed < 100, "Should have waited ~50ms");
    }
    
    @Test
    @DisplayName("Should be thread-safe under concurrent access")
    void shouldBeThreadSafe() throws InterruptedException {
        int capacity = 100;
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(capacity, 10, Duration.ofMinutes(1));
        
        AtomicInteger successCount = new AtomicInteger(0);
        int threadCount = 20;
        int requestsPerThread = 10;
        
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(threadCount);
        
        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    for (int j = 0; j < requestsPerThread; j++) {
                        if (limiter.tryAcquire()) {
                            successCount.incrementAndGet();
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    endLatch.countDown();
                }
            });
        }
        
        startLatch.countDown();
        endLatch.await(5, TimeUnit.SECONDS);
        executor.shutdown();
        
        assertEquals(capacity, successCount.get(), 
            "Exactly " + capacity + " requests should succeed");
    }
    
    @Test
    @DisplayName("Should provide accurate rate limit info")
    void shouldProvideAccurateRateLimitInfo() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(10, 1, Duration.ofSeconds(1));
        
        RateLimiter.RateLimitInfo info = limiter.getInfo();
        assertEquals(10, info.getLimit());
        assertEquals(10, info.getRemaining());
        
        limiter.tryAcquire(3);
        
        info = limiter.getInfo();
        assertEquals(10, info.getLimit());
        assertEquals(7, info.getRemaining());
    }
    
    @Test
    @DisplayName("perSecond factory should create appropriate limiter")
    void perSecondFactoryShouldWork() {
        TokenBucketRateLimiter limiter = TokenBucketRateLimiter.perSecond(100);
        
        // Should allow some burst
        int burst = 0;
        while (limiter.tryAcquire()) {
            burst++;
        }
        
        assertTrue(burst >= 10, "Should allow at least 10% burst");
    }
    
    @ParameterizedTest
    @ValueSource(ints = {-1, 0})
    @DisplayName("Should reject invalid capacity")
    void shouldRejectInvalidCapacity(int capacity) {
        assertThrows(IllegalArgumentException.class, () ->
            new TokenBucketRateLimiter(capacity, 1, Duration.ofSeconds(1))
        );
    }
    
    @Test
    @DisplayName("Should reject invalid refill tokens")
    void shouldRejectInvalidRefillTokens() {
        assertThrows(IllegalArgumentException.class, () ->
            new TokenBucketRateLimiter(10, 0, Duration.ofSeconds(1))
        );
    }
    
    @Test
    @DisplayName("Should reject invalid refill period")
    void shouldRejectInvalidRefillPeriod() {
        assertThrows(IllegalArgumentException.class, () ->
            new TokenBucketRateLimiter(10, 1, Duration.ZERO)
        );
    }
}
