# ratelimiter - Complete Implementation

## 📁 Project Structure (9 files)

```
ratelimiter/
├── api/RateLimiter.java
├── impl/SlidingWindowRateLimiter.java
├── impl/TokenBucketRateLimiter.java
├── metrics/RateLimiterMetrics.java
├── model/RateLimitAlgorithm.java
├── model/RateLimitConfig.java
├── model/RateLimitResult.java
├── rules/RateLimitRule.java
├── strategy/RateLimitStrategy.java
```

## 📝 Source Code

### 📄 `api/RateLimiter.java`

```java
package com.you.lld.problems.ratelimiter.api;

import com.you.lld.problems.ratelimiter.model.RateLimitResult;

public interface RateLimiter {
    RateLimitResult allowRequest(String clientId);
    void resetLimit(String clientId);
    int getRemainingRequests(String clientId);
}
```

### 📄 `impl/SlidingWindowRateLimiter.java`

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

### 📄 `impl/TokenBucketRateLimiter.java`

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
        private int tokens;
        
        TokenBucket(int initialTokens) {
            this.tokens = initialTokens;
        }
        
        synchronized boolean tryConsume() {
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }
        
        synchronized void refill(int count) {
            tokens += count;
        }
        
        synchronized int getTokens() {
            return tokens;
        }
    }
}
```

### 📄 `metrics/RateLimiterMetrics.java`

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

### 📄 `model/RateLimitAlgorithm.java`

```java
package com.you.lld.problems.ratelimiter.model;

public enum RateLimitAlgorithm {
    TOKEN_BUCKET,
    SLIDING_WINDOW,
    LEAKY_BUCKET,
    FIXED_WINDOW
}
```

### 📄 `model/RateLimitConfig.java`

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

### 📄 `model/RateLimitResult.java`

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
    
    public boolean isAllowed() { return allowed; }
    public long getRetryAfterMillis() { return retryAfterMillis; }
    public int getRemainingRequests() { return remainingRequests; }
    
    @Override
    public String toString() {
        return allowed ? 
            "ALLOWED (remaining: " + remainingRequests + ")" :
            "BLOCKED (retry after: " + retryAfterMillis + "ms)";
    }
}
```

### 📄 `rules/RateLimitRule.java`

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

### 📄 `strategy/RateLimitStrategy.java`

```java
package com.you.lld.problems.ratelimiter.strategy;

public interface RateLimitStrategy {
    boolean allowRequest(String userId);
    void reset(String userId);
}
```

