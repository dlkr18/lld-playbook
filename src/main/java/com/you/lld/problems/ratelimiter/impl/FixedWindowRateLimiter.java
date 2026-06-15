package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.RateLimitResult;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Fixed window: count requests per wall-clock window. Simple but boundary bursts possible.
 */
public class FixedWindowRateLimiter implements RateLimiter {
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<String, Window>();
    private final int maxRequests;
    private final long windowMillis;

    public FixedWindowRateLimiter(int maxRequests, long windowMillis) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowMillis;
    }

    @Override
    public RateLimitResult allowRequest(String clientId) {
        long now = System.currentTimeMillis();
        Window window = windows.computeIfAbsent(clientId, new java.util.function.Function<String, Window>() {
            @Override
            public Window apply(String k) {
                return new Window(now);
            }
        });
        synchronized (window) {
            if (now - window.startMillis >= windowMillis) {
                window.startMillis = now;
                window.count.set(0);
            }
            if (window.count.get() < maxRequests) {
                window.count.incrementAndGet();
                return RateLimitResult.allowed(maxRequests - window.count.get());
            }
            long retryAfter = window.startMillis + windowMillis - now;
            return RateLimitResult.blocked(Math.max(retryAfter, 1));
        }
    }

    @Override
    public void resetLimit(String clientId) {
        windows.remove(clientId);
    }

    @Override
    public int getRemainingRequests(String clientId) {
        Window window = windows.get(clientId);
        if (window == null) {
            return maxRequests;
        }
        synchronized (window) {
            long now = System.currentTimeMillis();
            if (now - window.startMillis >= windowMillis) {
                return maxRequests;
            }
            return Math.max(0, maxRequests - window.count.get());
        }
    }

    private static final class Window {
        private long startMillis;
        private final AtomicInteger count = new AtomicInteger(0);

        Window(long startMillis) {
            this.startMillis = startMillis;
        }
    }
}
