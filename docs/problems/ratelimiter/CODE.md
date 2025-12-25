# Rate Limiter - Complete Implementation 🚦

Production-ready Rate Limiter implementations with **Token Bucket** and **Sliding Window** algorithms. Essential for API throttling, DDoS protection, and resource management.

---

## 🎯 **What You'll Learn**

✅ **Token Bucket Algorithm** - Burst-friendly rate limiting  
✅ **Sliding Window Algorithm** - Accurate time-based limiting  
✅ **Thread-Safe Implementation** - Concurrent request handling  
✅ **Backpressure Strategies** - Blocking vs non-blocking  
✅ **Rate Limit Headers** - HTTP API integration  

---

## 📊 **Algorithm Comparison**

| Algorithm | Pros | Cons | Use Case |
|-----------|------|------|----------|
| **Token Bucket** | Allows bursts, smooth long-term rate | Complex refill logic | API throttling with burst tolerance |
| **Fixed Window** | Simple, memory efficient | Boundary issues (2x burst) | Basic quotas |
| **Sliding Window** | Smooth, accurate | More memory, complex | Accurate rate enforcement |
| **Leaky Bucket** | Constant output rate | No burst support | Traffic shaping |

---

## 💻 **Core Interface**

### **RateLimiter.java** - Universal Interface

```java
package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiter interface for controlling request throughput.
 * 
 * <p>Implementations include:
 * <ul>
 *   <li>Token Bucket - Allows burst up to capacity</li>
 *   <li>Leaky Bucket - Constant output rate</li>
 *   <li>Sliding Window - Accurate time-based limiting</li>
 * </ul>
 */
public interface RateLimiter {
    
    /**
     * Attempts to acquire a single permit.
     * 
     * @return true if permit acquired, false otherwise
     */
    boolean tryAcquire();
    
    /**
     * Attempts to acquire multiple permits.
     * 
     * @param permits Number of permits to acquire
     * @return true if all permits acquired, false otherwise
     */
    boolean tryAcquire(int permits);
    
    /**
     * Acquires a permit, blocking until available.
     * 
     * @throws InterruptedException if interrupted while waiting
     */
    void acquire() throws InterruptedException;
    
    /**
     * Attempts to acquire a permit within the given timeout.
     * 
     * @param timeout Maximum time to wait
     * @param unit Time unit
     * @return true if permit acquired within timeout
     * @throws InterruptedException if interrupted while waiting
     */
    boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException;
    
    /**
     * Returns current rate limit info.
     */
    RateLimitInfo getInfo();
    
    /**
     * Information about current rate limit state.
     */
    class RateLimitInfo {
        private final int remaining;
        private final int limit;
        private final long resetTimeMillis;
        
        public RateLimitInfo(int remaining, int limit, long resetTimeMillis) {
            this.remaining = remaining;
            this.limit = limit;
            this.resetTimeMillis = resetTimeMillis;
        }
        
        public int getRemaining() { return remaining; }
        public int getLimit() { return limit; }
        public long getResetTimeMillis() { return resetTimeMillis; }
        
        public Duration getTimeUntilReset() {
            long now = System.currentTimeMillis();
            return Duration.ofMillis(Math.max(0, resetTimeMillis - now));
        }
    }
}
```

---

## 🪙 **Token Bucket Implementation**

### **How Token Bucket Works:**

```
Bucket Capacity: 10 tokens (burst size)
Refill Rate: 100 tokens/minute
```

**Timeline:**
```
T=0s:   [🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙] (10 tokens - full)
        Request 5 → SUCCESS
T=1s:   [🪙🪙🪙🪙🪙] (5 tokens remaining)
T=30s:  [🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙] (refilled 50 tokens, capped at 10)
        Burst of 10 requests → ALL SUCCESS
T=31s:  [_] (0 tokens)
        1 more request → REJECTED
T=32s:  [🪙] (1 token refilled)
```

### **Token BucketRateLimiter.java** - Complete Implementation

```java
package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Token Bucket rate limiter implementation.
 * 
 * <p>The token bucket algorithm allows burst traffic up to the bucket capacity,
 * while maintaining a long-term average rate.
 * 
 * <h3>How it works:</h3>
 * <ul>
 *   <li>Bucket starts full with {@code capacity} tokens</li>
 *   <li>Tokens are added at rate {@code refillTokens/refillPeriod}</li>
 *   <li>Each request consumes one token</li>
 *   <li>Requests are rejected if no tokens available</li>
 * </ul>
 * 
 * <h3>Example:</h3>
 * <pre>{@code
 * // Allow 100 requests/minute with burst of 10
 * RateLimiter limiter = new TokenBucketRateLimiter(10, 100, Duration.ofMinutes(1));
 * 
 * if (limiter.tryAcquire()) {
 *     // Process request
 * } else {
 *     // Rate limited - return 429
 * }
 * }</pre>
 * 
 * <p>Thread-safe.
 */
public class TokenBucketRateLimiter implements RateLimiter {
    
    private final int capacity;
    private final int refillTokens;
    private final long refillPeriodNanos;
    
    private double availableTokens;
    private long lastRefillTime;
    
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition tokensAvailable = lock.newCondition();
    
    /**
     * Creates a new Token Bucket rate limiter.
     * 
     * @param capacity Maximum number of tokens (burst size)
     * @param refillTokens Tokens to add per refill period
     * @param refillPeriod How often to add tokens
     */
    public TokenBucketRateLimiter(int capacity, int refillTokens, Duration refillPeriod) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        if (refillTokens <= 0) {
            throw new IllegalArgumentException("Refill tokens must be positive");
        }
        if (refillPeriod.isNegative() || refillPeriod.isZero()) {
            throw new IllegalArgumentException("Refill period must be positive");
        }
        
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillPeriodNanos = refillPeriod.toNanos();
        this.availableTokens = capacity;
        this.lastRefillTime = System.nanoTime();
    }
    
    /**
     * Convenience constructor for simple rate limiting.
     * 
     * @param requestsPerSecond Maximum average rate
     */
    public static TokenBucketRateLimiter perSecond(int requestsPerSecond) {
        return new TokenBucketRateLimiter(
            Math.max(1, requestsPerSecond / 10),  // 10% burst
            requestsPerSecond,
            Duration.ofSeconds(1)
        );
    }
    
    @Override
    public boolean tryAcquire() {
        return tryAcquire(1);
    }
    
    @Override
    public boolean tryAcquire(int permits) {
        if (permits <= 0) {
            throw new IllegalArgumentException("Permits must be positive");
        }
        
        lock.lock();
        try {
            refill();
            
            if (availableTokens >= permits) {
                availableTokens -= permits;
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public void acquire() throws InterruptedException {
        lock.lockInterruptibly();
        try {
            while (true) {
                refill();
                
                if (availableTokens >= 1) {
                    availableTokens -= 1;
                    return;
                }
                
                // Wait for next refill
                long waitNanos = calculateWaitTime(1);
                tokensAvailable.awaitNanos(waitNanos);
            }
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException {
        long deadlineNanos = System.nanoTime() + unit.toNanos(timeout);
        
        lock.lockInterruptibly();
        try {
            while (true) {
                refill();
                
                if (availableTokens >= 1) {
                    availableTokens -= 1;
                    return true;
                }
                
                long remainingNanos = deadlineNanos - System.nanoTime();
                if (remainingNanos <= 0) {
                    return false;
                }
                
                long waitNanos = Math.min(remainingNanos, calculateWaitTime(1));
                tokensAvailable.awaitNanos(waitNanos);
            }
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public RateLimitInfo getInfo() {
        lock.lock();
        try {
            refill();
            long resetTime = lastRefillTime + refillPeriodNanos;
            return new RateLimitInfo(
                (int) availableTokens,
                capacity,
                resetTime / 1_000_000 // Convert to millis
            );
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Refills tokens based on elapsed time.
     * Must be called while holding the lock.
     */
    private void refill() {
        long now = System.nanoTime();
        long elapsed = now - lastRefillTime;
        
        if (elapsed > 0) {
            // Calculate tokens to add based on elapsed time
            double tokensToAdd = (double) elapsed / refillPeriodNanos * refillTokens;
            availableTokens = Math.min(capacity, availableTokens + tokensToAdd);
            lastRefillTime = now;
            
            if (availableTokens >= 1) {
                tokensAvailable.signalAll();
            }
        }
    }
    
    /**
     * Calculates wait time for the requested number of tokens.
     */
    private long calculateWaitTime(int permits) {
        double tokensNeeded = permits - availableTokens;
        if (tokensNeeded <= 0) {
            return 0;
        }
        return (long) (tokensNeeded / refillTokens * refillPeriodNanos);
    }
}
```

---

## 📊 **Sliding Window Implementation**

### **How Sliding Window Works:**

```
Window: 60 seconds
Limit: 100 requests

Previous Window: [====80 requests====]
Current Window:  [====40 requests====]
                 ↑
                 30s into current window

Weighted Count = 80 * (1 - 0.5) + 40 = 40 + 40 = 80
Remaining: 100 - 80 = 20 requests allowed
```

### **SlidingWindowRateLimiter.java** - Complete Implementation

```java
package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Sliding Window Counter rate limiter implementation.
 * 
 * <p>Uses a weighted average of current and previous window counts
 * to provide smoother rate limiting than fixed windows.
 * 
 * <h3>How it works:</h3>
 * <ul>
 *   <li>Divides time into fixed windows</li>
 *   <li>Counts requests in current and previous windows</li>
 *   <li>Calculates weighted count based on position in current window</li>
 *   <li>Rejects if weighted count exceeds limit</li>
 * </ul>
 * 
 * <h3>Example:</h3>
 * <pre>{@code
 * // 100 requests per minute
 * RateLimiter limiter = new SlidingWindowRateLimiter(100, Duration.ofMinutes(1));
 * 
 * if (limiter.tryAcquire()) {
 *     // Process request
 * }
 * }</pre>
 * 
 * <p>More accurate than fixed window at boundaries, more memory efficient
 * than sliding window log.
 */
public class SlidingWindowRateLimiter implements RateLimiter {
    
    private final int maxRequests;
    private final long windowSizeMillis;
    
    private final Lock lock = new ReentrantLock();
    
    private long currentWindowStart;
    private long previousWindowCount;
    private long currentWindowCount;
    
    /**
     * Creates a new Sliding Window rate limiter.
     * 
     * @param maxRequests Maximum requests allowed per window
     * @param windowSize Size of the time window
     */
    public SlidingWindowRateLimiter(int maxRequests, Duration windowSize) {
        if (maxRequests <= 0) {
            throw new IllegalArgumentException("Max requests must be positive");
        }
        if (windowSize.isNegative() || windowSize.isZero()) {
            throw new IllegalArgumentException("Window size must be positive");
        }
        
        this.maxRequests = maxRequests;
        this.windowSizeMillis = windowSize.toMillis();
        this.currentWindowStart = getCurrentWindowStart();
        this.previousWindowCount = 0;
        this.currentWindowCount = 0;
    }
    
    @Override
    public boolean tryAcquire() {
        return tryAcquire(1);
    }
    
    @Override
    public boolean tryAcquire(int permits) {
        lock.lock();
        try {
            slideWindow();
            
            double weightedCount = getWeightedCount();
            
            if (weightedCount + permits <= maxRequests) {
                currentWindowCount += permits;
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
    @Override
    public void acquire() throws InterruptedException {
        while (true) {
            if (tryAcquire()) {
                return;
            }
            
            // Wait until some requests should have "expired"
            long waitTime = estimateWaitTime();
            if (waitTime > 0) {
                Thread.sleep(waitTime);
            }
        }
    }
    
    @Override
    public boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException {
        long deadlineMillis = System.currentTimeMillis() + unit.toMillis(timeout);
        
        while (true) {
            if (tryAcquire()) {
                return true;
            }
            
            long remainingMillis = deadlineMillis - System.currentTimeMillis();
            if (remainingMillis <= 0) {
                return false;
            }
            
            long waitTime = Math.min(remainingMillis, estimateWaitTime());
            if (waitTime > 0) {
                Thread.sleep(waitTime);
            }
        }
    }
    
    @Override
    public RateLimitInfo getInfo() {
        lock.lock();
        try {
            slideWindow();
            int weightedCount = (int) getWeightedCount();
            return new RateLimitInfo(
                Math.max(0, maxRequests - weightedCount),
                maxRequests,
                currentWindowStart + windowSizeMillis
            );
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Slides the window forward if needed.
     */
    private void slideWindow() {
        long now = System.currentTimeMillis();
        long windowStart = getCurrentWindowStart();
        
        if (windowStart > currentWindowStart) {
            // Check if we've moved more than one window
            if (windowStart - currentWindowStart >= windowSizeMillis) {
                // Previous window is too old
                previousWindowCount = 0;
                currentWindowCount = 0;
            } else {
                // Slide window
                previousWindowCount = currentWindowCount;
                currentWindowCount = 0;
            }
            currentWindowStart = windowStart;
        }
    }
    
    /**
     * Calculates the weighted request count.
     * 
     * Formula: prevCount * (1 - position) + currentCount
     * where position is [0, 1) within current window.
     */
    private double getWeightedCount() {
        long now = System.currentTimeMillis();
        long elapsedInWindow = now - currentWindowStart;
        double position = (double) elapsedInWindow / windowSizeMillis;
        
        // Weight previous window by remaining time
        double previousWeight = 1.0 - position;
        
        return previousWindowCount * previousWeight + currentWindowCount;
    }
    
    /**
     * Estimates wait time until a permit might be available.
     */
    private long estimateWaitTime() {
        double weightedCount = getWeightedCount();
        if (weightedCount < maxRequests) {
            return 0;
        }
        
        // Estimate when previous window weight will decrease enough
        double excess = weightedCount - maxRequests + 1;
        if (previousWindowCount > 0) {
            double waitFraction = excess / previousWindowCount;
            return (long) (waitFraction * windowSizeMillis) + 1;
        }
        
        // No previous count - wait for next window
        return windowSizeMillis - (System.currentTimeMillis() - currentWindowStart);
    }
    
    /**
     * Gets the start time of the current window.
     */
    private long getCurrentWindowStart() {
        long now = System.currentTimeMillis();
        return now - (now % windowSizeMillis);
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: API Endpoint Protection**

```java
// In your API controller
public class UserController {
    // 100 requests per minute, burst of 20
    private final RateLimiter globalLimiter = 
        new TokenBucketRateLimiter(20, 100, Duration.ofMinutes(1));
    
    // Per-user rate limiter
    private final Map<String, RateLimiter> userLimiters = new ConcurrentHashMap<>();
    
    @PostMapping("/api/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserDto dto) {
        // Check global limit
        if (!globalLimiter.tryAcquire()) {
            return ResponseEntity.status(429)
                .header("X-RateLimit-Limit", "100")
                .header("X-RateLimit-Remaining", "0")
                .header("Retry-After", "60")
                .body("Too many requests");
        }
        
        // Check per-user limit (10 requests/minute)
        RateLimiter userLimiter = userLimiters.computeIfAbsent(
            id, 
            k -> new SlidingWindowRateLimiter(10, Duration.ofMinutes(1))
        );
        
        if (!userLimiter.tryAcquire()) {
            return ResponseEntity.status(429).body("User rate limit exceeded");
        }
        
        // Process request
        return ResponseEntity.ok(userService.update(id, dto));
    }
}
```

### **Example 2: Graceful Degradation**

```java
public class DataService {
    private final RateLimiter dbLimiter = TokenBucketRateLimiter.perSecond(100);
    private final Cache<String, Data> cache = CaffeineCache.newBuilder().build();
    
    public Data getData(String key) {
        // Try database first
        if (dbLimiter.tryAcquire()) {
            Data data = database.query(key);
            cache.put(key, data);
            return data;
        }
        
        // Fall back to cache if rate limited
        Data cachedData = cache.getIfPresent(key);
        if (cachedData != null) {
            logger.warn("Rate limited - serving from cache");
            return cachedData;
        }
        
        // Block if cache miss
        try {
            dbLimiter.acquire();
            return database.query(key);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while waiting for rate limit", e);
        }
    }
}
```

### **Example 3: Distributed Rate Limiting (Redis)**

```java
public class RedisRateLimiter implements RateLimiter {
    private final RedisTemplate<String, String> redis;
    private final String key;
    private final int maxRequests;
    private final Duration window;
    
    @Override
    public boolean tryAcquire() {
        String script = 
            "local current = redis.call('incr', KEYS[1]) " +
            "if current == 1 then " +
            "    redis.call('expire', KEYS[1], ARGV[1]) " +
            "end " +
            "return current <= tonumber(ARGV[2])";
        
        Boolean allowed = redis.execute(
            RedisScript.of(script, Boolean.class),
            Collections.singletonList(key),
            String.valueOf(window.getSeconds()),
            String.valueOf(maxRequests)
        );
        
        return Boolean.TRUE.equals(allowed);
    }
}
```

---

## 🎯 **HTTP Rate Limit Headers**

Standard headers for client communication:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 42
```

**Implementation:**

```java
public void addRateLimitHeaders(HttpServletResponse response, RateLimiter limiter) {
    RateLimitInfo info = limiter.getInfo();
    
    response.setHeader("X-RateLimit-Limit", String.valueOf(info.getLimit()));
    response.setHeader("X-RateLimit-Remaining", String.valueOf(info.getRemaining()));
    response.setHeader("X-RateLimit-Reset", 
        String.valueOf(info.getResetTimeMillis() / 1000));
    
    if (info.getRemaining() == 0) {
        long retryAfter = info.getTimeUntilReset().getSeconds();
        response.setHeader("Retry-After", String.valueOf(retryAfter));
    }
}
```

---

## 🚨 **Common Mistakes to Avoid**

### **1. Not Thread-Safe**
```java
// BAD: Race condition
private int requestCount = 0;

public boolean tryAcquire() {
    if (requestCount < limit) {  // Check
        requestCount++;           // Modify (NOT atomic!)
        return true;
    }
    return false;
}
```

### **2. Memory Leaks in Per-User Limiters**
```java
// BAD: Unbounded map growth
private final Map<String, RateLimiter> limiters = new HashMap<>();

// GOOD: Use bounded cache with TTL
private final Cache<String, RateLimiter> limiters = 
    Caffeine.newBuilder()
        .maximumSize(10_000)
        .expireAfterAccess(Duration.ofHours(1))
        .build();
```

### **3. Clock Skew Issues**
```java
// BAD: Using System.currentTimeMillis() in distributed systems
long now = System.currentTimeMillis();  // Can go backwards!

// GOOD: Use monotonic clock
long now = System.nanoTime();  // Monotonically increasing
```

---

## 📊 **Performance Characteristics**

| Algorithm | Time Complexity | Space Complexity | Accuracy |
|-----------|----------------|------------------|----------|
| Token Bucket | O(1) | O(1) | ~95% |
| Fixed Window | O(1) | O(1) | ~85% (boundary issues) |
| Sliding Window | O(1) | O(1) | ~99% |
| Sliding Log | O(N) | O(N) | 100% (exact) |

---

## 🔗 **Related Resources**

- [Day 11: Rate Limiter Theory](week3/day11/README.md) - Algorithm explanations
- [Caching Strategies](week2/day10/README.md) - Combining with caching
- [Concurrency Patterns](week2/README.md) - Thread-safe designs

---

## 🎓 **Practice Exercises**

1. **Implement Leaky Bucket**: Constant output rate, no bursts
2. **Add Metrics**: Track hit/miss rates, average wait times
3. **Implement Distributed Limiter**: Using Redis or Hazelcast
4. **Add Warm-up Period**: Gradually increase rate for new services
5. **Implement Hierarchical Limits**: Global → Per-tenant → Per-user

---

**Source Code Location**: `src/main/java/com/you/lld/patterns/behavioral/ratelimiter/`

**Tests**: `src/test/java/com/you/lld/patterns/behavioral/ratelimiter/`

---

✨ **Production-ready rate limiting for high-throughput systems!** 🚦

