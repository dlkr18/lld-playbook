# Day 11 Exercises: Rate Limiter 📝

---

## 🎯 **Exercise 1: Token Bucket Implementation**

### **Requirements**
Implement a thread-safe Token Bucket rate limiter:

```java
public interface RateLimiter {
    boolean tryAcquire();
    boolean tryAcquire(int permits);
    void acquire() throws InterruptedException;
    boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException;
}

public class TokenBucketRateLimiter implements RateLimiter {
    // Constructor
    public TokenBucketRateLimiter(int capacity, int refillTokens, Duration refillPeriod);
}
```

### **Behavior**
- Bucket starts full with `capacity` tokens
- Every `refillPeriod`, add `refillTokens` tokens (up to capacity)
- `tryAcquire()` removes one token if available
- `acquire()` blocks until token available

### **Test Cases**
```java
RateLimiter limiter = new TokenBucketRateLimiter(10, 1, Duration.ofSeconds(1));

// Should succeed 10 times initially
for (int i = 0; i < 10; i++) {
    assertTrue(limiter.tryAcquire());
}

// 11th call should fail
assertFalse(limiter.tryAcquire());

// After 1 second, should have 1 token
Thread.sleep(1000);
assertTrue(limiter.tryAcquire());
```

---

## 🎯 **Exercise 2: Leaky Bucket Implementation**

### **Requirements**
Implement a Leaky Bucket rate limiter (constant output rate):

```java
public class LeakyBucketRateLimiter implements RateLimiter {
    // Queue capacity and output rate
    public LeakyBucketRateLimiter(int queueCapacity, int requestsPerSecond);
}
```

### **Behavior**
- Requests are queued (up to capacity)
- Requests are processed at constant rate
- If queue is full, reject new requests
- Smooth output rate regardless of burst input

### **Visual Example**
```
Input:  ||||||||........||||||||    (burst input)
Output: |.|.|.|.|.|.|.|.|.|.|.|.|  (smooth output)
```

### **Test Cases**
```java
LeakyBucketRateLimiter limiter = new LeakyBucketRateLimiter(5, 2);

// Burst of 5 requests should be queued
for (int i = 0; i < 5; i++) {
    assertTrue(limiter.tryAcquire());
}

// 6th should be rejected (queue full)
assertFalse(limiter.tryAcquire());

// Verify output rate is ~2/second
```

---

## 🎯 **Exercise 3: Sliding Window Counter**

### **Requirements**
Implement a Sliding Window rate limiter:

```java
public class SlidingWindowRateLimiter implements RateLimiter {
    public SlidingWindowRateLimiter(int maxRequests, Duration windowSize);
    
    // Additional methods
    public long getRequestCount();
    public long getWindowStartTime();
}
```

### **Behavior**
- Count requests in the last `windowSize` duration
- Reject if count >= `maxRequests`
- More accurate than fixed window (no boundary issues)

### **Implementation Options**
1. **Sliding Window Log**: Store timestamp of each request
2. **Sliding Window Counter**: Weighted average of current and previous window

### **Test Cases**
```java
SlidingWindowRateLimiter limiter = new SlidingWindowRateLimiter(100, Duration.ofMinutes(1));

// Make 50 requests
for (int i = 0; i < 50; i++) {
    assertTrue(limiter.tryAcquire());
}
assertEquals(50, limiter.getRequestCount());

// Make 50 more
for (int i = 0; i < 50; i++) {
    assertTrue(limiter.tryAcquire());
}

// 101st should fail
assertFalse(limiter.tryAcquire());
```

---

## 🎯 **Exercise 4: Multi-Key Rate Limiter**

### **Scenario**
Build a rate limiter that tracks limits per user/API key:

### **Requirements**
```java
public interface KeyedRateLimiter {
    boolean tryAcquire(String key);
    boolean tryAcquire(String key, int permits);
    RateLimitInfo getRateLimitInfo(String key);
}

public class RateLimitInfo {
    private final int remaining;
    private final int limit;
    private final Instant resetAt;
}
```

### **Configuration**
```java
RateLimitConfig config = RateLimitConfig.builder()
    .defaultLimit(100, Duration.ofMinutes(1))
    .withTier("premium", 1000, Duration.ofMinutes(1))
    .withTier("free", 10, Duration.ofMinutes(1))
    .build();

KeyedRateLimiter limiter = new KeyedRateLimiter(config);

// Different users get different limits
limiter.tryAcquire("user:free:123");     // Free tier
limiter.tryAcquire("user:premium:456");  // Premium tier
limiter.tryAcquire("api:default:789");   // Default tier
```

### **HTTP Headers**
Your limiter should support generating standard rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1640000000
```

---

## 🎯 **Exercise 5: Distributed Rate Limiter**

### **Scenario**
Design a rate limiter that works across multiple servers.

### **Requirements**
1. Consistent rate limiting across instances
2. Use Redis as distributed state store
3. Handle Redis failures gracefully
4. Support atomic operations

### **Interface**
```java
public interface DistributedRateLimiter {
    CompletableFuture<RateLimitResult> tryAcquireAsync(String key);
    RateLimitResult tryAcquire(String key);
}

public class RateLimitResult {
    private final boolean allowed;
    private final int remaining;
    private final Duration retryAfter;
}
```

### **Redis Commands (Pseudo-code)**
```lua
-- Sliding window with Redis sorted sets
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- Remove old entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current entries
local current = redis.call('ZCARD', key)

if current < limit then
    -- Add new entry
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, window / 1000)
    return {1, limit - current - 1}  -- allowed, remaining
else
    return {0, 0}  -- rejected, remaining
end
```

---

## 🎯 **Exercise 6: API Gateway Rate Limiter**

### **Scenario**
Build a complete API Gateway rate limiter with multiple policies.

### **Requirements**
1. **Per-IP limiting**: Prevent DDoS
2. **Per-User limiting**: Fair usage
3. **Per-Endpoint limiting**: Protect expensive operations
4. **Concurrent request limiting**: Max simultaneous requests

### **Configuration**
```java
RateLimitPolicy policy = RateLimitPolicy.builder()
    .name("api-gateway")
    .addRule(RuleType.IP, 1000, Duration.ofHours(1))
    .addRule(RuleType.USER, 100, Duration.ofMinutes(1))
    .addRule(RuleType.ENDPOINT, "/search", 10, Duration.ofMinutes(1))
    .addRule(RuleType.CONCURRENT, 5)
    .onLimitExceeded(response -> {
        response.setStatus(429);
        response.setHeader("Retry-After", "60");
    })
    .build();
```

### **Metrics**
Track and expose:
- Total requests
- Rejected requests
- Rejection rate
- Average wait time
- Per-key statistics

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Adaptive Rate Limiting**
Create a rate limiter that adjusts limits based on system load:
```java
AdaptiveRateLimiter limiter = AdaptiveRateLimiter.builder()
    .baseLimit(100)
    .minLimit(10)
    .maxLimit(500)
    .loadThreshold(0.8)
    .scaleDownFactor(0.5)
    .scaleUpFactor(1.2)
    .build();

// When CPU > 80%, reduce limits
// When CPU < 50%, increase limits
```

### **Challenge 2: Priority Queue Rate Limiter**
Implement rate limiting with request priorities:
```java
PriorityRateLimiter limiter = new PriorityRateLimiter(100);
limiter.tryAcquire("key", Priority.HIGH);    // Higher chance
limiter.tryAcquire("key", Priority.NORMAL);  // Normal
limiter.tryAcquire("key", Priority.LOW);     // Lower chance when near limit
```

### **Challenge 3: Circuit Breaker + Rate Limiter**
Combine patterns:
```java
ResilientService service = ResilientService.builder()
    .rateLimiter(TokenBucket(100, 10, Duration.ofSeconds(1)))
    .circuitBreaker(threshold(5), timeout(Duration.ofSeconds(30)))
    .fallback(() -> defaultResponse)
    .build();
```

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Correctness** - Accurate rate limiting | 25 |
| **Thread Safety** - Handles concurrency | 25 |
| **Performance** - Minimal overhead | 20 |
| **Testing** - Edge cases covered | 15 |
| **Production Ready** - Metrics, logging | 15 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week3/day11/EXERCISE_SOLUTIONS.md)
