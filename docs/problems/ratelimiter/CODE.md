# ratelimiter - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/ratelimiter/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py ratelimiter`.

## Project Structure (14 files)

```
ratelimiter/
├── RateLimiterDemo.java
├── RateLimiterGateway.java
├── api/RateLimiter.java
├── model/RateLimitAlgorithm.java
├── model/RateLimitConfig.java
├── model/RateLimitResult.java
├── impl/FixedWindowRateLimiter.java
├── impl/LeakyBucketRateLimiter.java
├── impl/RateLimiterFactory.java
├── impl/SlidingWindowRateLimiter.java
├── impl/TokenBucketRateLimiter.java
├── metrics/RateLimiterMetrics.java
├── rules/RateLimitRule.java
├── strategy/RateLimitStrategy.java
```

## Source Code

### `RateLimiterDemo.java`

<details>
<summary>Click to view RateLimiterDemo.java</summary>

```java
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
```

</details>

### `RateLimiterGateway.java`

<details>
<summary>Click to view RateLimiterGateway.java</summary>

```java
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
```

</details>

### `api/RateLimiter.java`

<details>
<summary>Click to view api/RateLimiter.java</summary>

```java
package com.you.lld.problems.ratelimiter.api;

import com.you.lld.problems.ratelimiter.model.RateLimitResult;

public interface RateLimiter {
    RateLimitResult allowRequest(String clientId);

    void resetLimit(String clientId);

    int getRemainingRequests(String clientId);
}
```

</details>

### `model/RateLimitAlgorithm.java`

<details>
<summary>Click to view model/RateLimitAlgorithm.java</summary>

```java
package com.you.lld.problems.ratelimiter.model;

public enum RateLimitAlgorithm {
    TOKEN_BUCKET,
    SLIDING_WINDOW,
    LEAKY_BUCKET,
    FIXED_WINDOW
}
```

</details>

### `model/RateLimitConfig.java`

<details>
<summary>Click to view model/RateLimitConfig.java</summary>

```java
package com.you.lld.problems.ratelimiter.model;

public class RateLimitConfig {
    private final int maxRequests;
    private final long timeWindowMillis;
    
    public RateLimitConfig(int maxRequests, long timeWindowMillis) {
        this.maxRequests = maxRequests;
        this.timeWindowMillis = timeWindowMillis;
    }
    
    public int getMaxRequests() { return maxRequests; }
    public long getTimeWindowMillis() { return timeWindowMillis; }
    
    @Override
    public String toString() {
        return "RateLimitConfig{maxRequests=" + maxRequests + 
               ", timeWindow=" + timeWindowMillis + "ms}";
    }
}
```

</details>

### `model/RateLimitResult.java`

<details>
<summary>Click to view model/RateLimitResult.java</summary>

```java
package com.you.lld.problems.ratelimiter.model;

public class RateLimitResult {
    private final boolean allowed;
    private final long retryAfterMillis;
    private final int remainingRequests;

    public RateLimitResult(boolean allowed, long retryAfterMillis, int remainingRequests) {
        this.allowed = allowed;
        this.retryAfterMillis = retryAfterMillis;
        this.remainingRequests = remainingRequests;
    }

    public static RateLimitResult allowed(int remaining) {
        return new RateLimitResult(true, 0, remaining);
    }

    public static RateLimitResult blocked(long retryAfter) {
        return new RateLimitResult(false, retryAfter, 0);
    }

    public boolean isAllowed() {
        return allowed;
    }

    public long getRetryAfterMillis() {
        return retryAfterMillis;
    }

    public int getRemainingRequests() {
        return remainingRequests;
    }

    @Override
    public String toString() {
        return allowed ?
                "ALLOWED (remaining: " + remainingRequests + ")" :
                "BLOCKED (retry after: " + retryAfterMillis + "ms)";
    }
}
```

</details>

### `impl/FixedWindowRateLimiter.java`

<details>
<summary>Click to view impl/FixedWindowRateLimiter.java</summary>

```java
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
```

</details>

### `impl/LeakyBucketRateLimiter.java`

<details>
<summary>Click to view impl/LeakyBucketRateLimiter.java</summary>

```java
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
```

</details>

### `impl/RateLimiterFactory.java`

<details>
<summary>Click to view impl/RateLimiterFactory.java</summary>

```java
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
```

</details>

### `impl/SlidingWindowRateLimiter.java`

<details>
<summary>Click to view impl/SlidingWindowRateLimiter.java</summary>

```java
package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.*;
import java.util.concurrent.*;
import java.util.*;

/**
 * Sliding Window Rate Limiter
 * 
 * Algorithm:
 * - Tracks timestamps of all requests in a window
 * - Slides window forward with time
 * - Counts requests in current window
 * 
 * Pros:
 * - Most accurate
 * - No burst issues
 * 
 * Cons:
 * - Memory intensive (stores all timestamps)
 */
public class SlidingWindowRateLimiter implements RateLimiter {
    
    private final ConcurrentHashMap<String, Queue<Long>> requestTimestamps = new ConcurrentHashMap<>();
    private final int maxRequests;
    private final long windowMillis;
    
    public SlidingWindowRateLimiter(int maxRequests, long windowMillis) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowMillis;
    }
    
    @Override
    public RateLimitResult allowRequest(String clientId) {
        long now = System.currentTimeMillis();
        Queue<Long> timestamps = requestTimestamps.computeIfAbsent(
            clientId,
            k -> new ConcurrentLinkedQueue<>()
        );
        
        // Remove old timestamps
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peek() < now - windowMillis) {
                timestamps.poll();
            }
            
            if (timestamps.size() < maxRequests) {
                timestamps.offer(now);
                return RateLimitResult.allowed(maxRequests - timestamps.size());
            } else {
                long oldestTimestamp = timestamps.peek();
                long retryAfter = oldestTimestamp + windowMillis - now;
                return RateLimitResult.blocked(retryAfter);
            }
        }
    }
    
    @Override
    public void resetLimit(String clientId) {
        Queue<Long> timestamps = requestTimestamps.get(clientId);
        if (timestamps != null) {
            timestamps.clear();
        }
    }
    
    @Override
    public int getRemainingRequests(String clientId) {
        long now = System.currentTimeMillis();
        Queue<Long> timestamps = requestTimestamps.get(clientId);
        
        if (timestamps == null) {
            return maxRequests;
        }
        
        synchronized (timestamps) {
            // Remove old
            while (!timestamps.isEmpty() && timestamps.peek() < now - windowMillis) {
                timestamps.poll();
            }
            return maxRequests - timestamps.size();
        }
    }
}
```

</details>

### `impl/TokenBucketRateLimiter.java`

<details>
<summary>Click to view impl/TokenBucketRateLimiter.java</summary>

```java
package com.you.lld.problems.ratelimiter.impl;

import com.you.lld.problems.ratelimiter.api.RateLimiter;
import com.you.lld.problems.ratelimiter.model.*;
import java.util.concurrent.*;

/**
 * Token Bucket Rate Limiter
 * 
 * Algorithm:
 * - Bucket holds tokens (up to capacity)
 * - Tokens refill at a constant rate
 * - Each request consumes 1 token
 * - Request allowed only if token available
 * 
 * Pros:
 * - Handles bursts (bucket capacity)
 * - Smooth refill rate
 * - Memory efficient
 * 
 * Cons:
 * - Slightly complex implementation
 */
public class TokenBucketRateLimiter implements RateLimiter {
    
    private final ConcurrentHashMap<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    private final int capacity;
    private final int refillRate; // tokens per second
    private final ScheduledExecutorService refillScheduler;
    
    public TokenBucketRateLimiter(int capacity, int refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.refillScheduler = Executors.newScheduledThreadPool(1);
        
        // Refill tokens every 100ms
        refillScheduler.scheduleAtFixedRate(
            this::refillAllBuckets, 
            100, 100, TimeUnit.MILLISECONDS
        );
    }
    
    @Override
    public RateLimitResult allowRequest(String clientId) {
        TokenBucket bucket = buckets.computeIfAbsent(
            clientId, 
            k -> new TokenBucket(capacity)
        );
        return bucket.tryConsume() ? 
            RateLimitResult.allowed(bucket.getTokens()) :
            RateLimitResult.blocked(calculateRetryAfter());
    }
    
    @Override
    public void resetLimit(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        if (bucket != null) {
            bucket.refill(capacity);
        }
    }
    
    @Override
    public int getRemainingRequests(String clientId) {
        TokenBucket bucket = buckets.get(clientId);
        return bucket != null ? bucket.getTokens() : capacity;
    }
    
    private void refillAllBuckets() {
        int tokensToAdd = refillRate / 10; // Per 100ms
        for (TokenBucket bucket : buckets.values()) {
            bucket.refill(Math.min(tokensToAdd, capacity - bucket.getTokens()));
        }
    }
    
    private long calculateRetryAfter() {
        return 1000 / refillRate; // Approximate
    }
    
    public void shutdown() {
        refillScheduler.shutdown();
    }
    
    private static class TokenBucket {
        private final int capacity;
        private int tokens;
        
        TokenBucket(int capacity) {
            this.capacity = capacity;
            this.tokens = capacity;
        }
        
        synchronized boolean tryConsume() {
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }
        
        synchronized void refill(int count) {
            tokens = Math.min(capacity, tokens + count);
        }
        
        synchronized int getTokens() {
            return tokens;
        }
    }
}
```

</details>

### `metrics/RateLimiterMetrics.java`

<details>
<summary>Click to view metrics/RateLimiterMetrics.java</summary>

```java
package com.you.lld.problems.ratelimiter.metrics;

public class RateLimiterMetrics {
    private long totalRequests;
    private long blockedRequests;
    
    public void recordRequest(boolean allowed) {
        totalRequests++;
        if (!allowed) {
            blockedRequests++;
        }
    }
    
    public long getTotalRequests() {
        return totalRequests;
    }
    
    public long getBlockedRequests() {
        return blockedRequests;
    }
    
    public double getBlockRate() {
        return totalRequests == 0 ? 0 : (double) blockedRequests / totalRequests;
    }
}
```

</details>

### `rules/RateLimitRule.java`

<details>
<summary>Click to view rules/RateLimitRule.java</summary>

```java
package com.you.lld.problems.ratelimiter.rules;

public class RateLimitRule {
    private final String name;
    private final int maxRequests;
    private final long windowMs;
    
    public RateLimitRule(String name, int maxRequests, long windowMs) {
        this.name = name;
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    
    public String getName() { return name; }
    public int getMaxRequests() { return maxRequests; }
    public long getWindowMs() { return windowMs; }
}
```

</details>

### `strategy/RateLimitStrategy.java`

<details>
<summary>Click to view strategy/RateLimitStrategy.java</summary>

```java
package com.you.lld.problems.ratelimiter.strategy;

public interface RateLimitStrategy {
    boolean allowRequest(String userId);
    void reset(String userId);
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ratelimiter.RateLimiterDemo"
```
