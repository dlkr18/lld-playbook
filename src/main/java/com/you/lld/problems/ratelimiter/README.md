# Rate Limiter — LLD

Design a per-client rate limiter supporting multiple algorithms, thread-safe in-process use (Redis extension as follow-up).

## Package Structure

```
ratelimiter/
  api/            RateLimiter interface
  model/          RateLimitResult, RateLimitAlgorithm, RateLimitConfig
  impl/           TokenBucket, SlidingWindow, FixedWindow, LeakyBucket, Factory
  RateLimiterGateway.java  Facade
  RateLimiterDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `RateLimiter` implementations | Swap algorithm without changing caller. |
| **Factory** | `RateLimiterFactory` | Centralize construction from config / enum. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ratelimiter.RateLimiterDemo"
```

## Key Talking Points

- **Token bucket** — allows bursts up to capacity; refill rate limits sustained QPS.
- **Sliding window** — accurate; stores timestamps (memory cost).
- **Fixed window** — O(1) memory; spikes at window boundaries (classic OA trap).
- **Leaky bucket** — smooth output rate; queue metaphor.
- **Thread-safety** — per-client buckets with `synchronized` or `ConcurrentHashMap`; distributed needs Redis + Lua atomicity.
