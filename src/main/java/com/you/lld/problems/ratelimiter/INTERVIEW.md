# Rate Limiter — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a per-client rate limiter supporting multiple algorithms with thread-safe in-process use (Redis extension as follow-up).

---

## 1. Clarifying Questions

- Limit dimension? (Per client ID / API key.)
- Algorithms needed? (Token bucket, sliding window, fixed window, leaky bucket.)
- Allow burst? (Token bucket yes; leaky bucket smooths output.)
- Response on deny? (`RateLimitResult` with allowed flag + retry-after.)
- Distributed deployment? (In-process demo; Redis + Lua for prod.)
- Configuration? (`RateLimitConfig` — capacity, refill rate, window size.)
- Global vs per-endpoint limits? (Per limiter instance — compose multiple.)

---

## 2. Functional Requirements

1. **allowRequest(clientId)** — return allow/deny with metadata.
2. **Token bucket** — burst up to capacity; steady refill rate.
3. **Sliding window** — accurate count in rolling interval.
4. **Fixed window** — O(1) counter per window bucket.
5. **Leaky bucket** — smooth output rate with queue metaphor.
6. **Factory** — construct limiter from `RateLimitAlgorithm` enum.
7. **Gateway facade** — single entry for demos.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Thread-safety** | Per-client state in `ConcurrentHashMap`; synchronized bucket updates |
| **Latency** | O(1) amortized for token/fixed window |
| **Memory** | Sliding window stores timestamps — bounded by max requests |
| **Extensibility** | `RateLimiter` interface; new algorithm = new impl |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `RateLimiter` | service | Contract | `allowRequest(clientId)` |
| `RateLimitConfig` | model | Parameters | Capacity, rate, windowMs |
| `RateLimitResult` | model | Decision DTO | allowed, remaining, retryAfterMs |
| `RateLimitAlgorithm` | model | Enum | TOKEN_BUCKET, SLIDING_WINDOW, etc. |
| `TokenBucketRateLimiter` | impl | Burst-friendly | Tokens + last refill time |
| `SlidingWindowRateLimiter` | impl | Accurate | Deque or list of timestamps |
| `FixedWindowRateLimiter` | impl | Simple | Counter + window start |
| `LeakyBucketRateLimiter` | impl | Smooth | Leak rate + queue level |
| `RateLimiterFactory` | impl | Factory | Maps enum → impl |
| `RateLimiterGateway` | orchestrator | Facade | Demo wiring |

---

## 5. Relationships

- `RateLimiterGateway` **delegates** to concrete `RateLimiter`.
- Each impl **owns** `Map<clientId, ClientState>` bucket.
- `RateLimiterFactory` **creates** limiters from config — no caller `new` of impls.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`RateLimiter` impls) | Swap algorithm per route or tenant |
| **Factory** (`RateLimiterFactory`) | Centralize construction; hide class names |

---

## 7. Key Implementation Details

### 7.1 Token bucket

On request: refill tokens by `(now - lastRefill) * rate`; if tokens >= 1, decrement and allow; else deny with retry-after from deficit/rate.

### 7.2 Sliding window

Remove timestamps older than window; if count < limit, append now and allow; else deny.

### 7.3 Fixed window boundary spike

Counter resets at window boundary — can allow 2× burst at edges (classic interview trap).

---

## 8. Likely Follow-Up Q&A

**Q: Distributed rate limit?**  
A: Redis INCR + EXPIRE or Lua script for atomic token bucket.

**Q: Token bucket vs leaky bucket?**  
A: Token allows ingress burst; leaky shapes egress rate.

**Q: Fairness across clients?**  
A: Isolated maps per clientId — one abusive client doesn't drain others.

**Q: Hierarchical limits?**  
A: Chain limiters — global then per-tenant.

**Q: Sliding window memory?**  
A: Count-min sketch or approximate sliding for high QPS.

**Q: Deny vs queue?**  
A: This API denies; leaky bucket can model queue with max size.

**Q: Clock skew?**  
A: Use monotonic `System.nanoTime()` for refill; NTP sync across nodes in prod.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Token bucket | User-friendly bursts; harder distributed sync |
| Fixed window | Cheapest; boundary spikes |
| Sliding window | Accurate; memory per request timestamp |
| In-process map | Zero network; not shared across instances |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ratelimiter.RateLimiterDemo"`
