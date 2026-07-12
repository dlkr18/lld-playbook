# URL Shortener — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a service mapping long URLs to short Base62 codes with pluggable encoding, collision handling, idempotent shorten, and resolve analytics.

---

## 1. Clarifying Questions

- Encoding? (Counter-based sequential vs hash-based deterministic.)
- Collision handling? (Linear probe up to 100 alternate codes.)
- Duplicate long URL? (Return existing short code — idempotent shorten.)
- Custom aliases? (Extension — validate uniqueness.)
- Analytics? (Access count + last accessed on resolve.)
- TTL / expiry? (Optional extension on mapping.)
- Scale? (In-memory `ConcurrentHashMap`; Redis/DB follow-up.)

---

## 2. Functional Requirements

1. **Shorten** — long URL → short code; validate URL format.
2. **Resolve** — short code → long URL; 404 if missing.
3. **Idempotent shorten** — same long URL returns same code.
4. **Collision probe** — on code clash, try next variant.
5. **Analytics** — increment access count on each resolve.
6. **Delete / stats** — admin operations (if exposed in service).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Latency** | O(1) resolve via hash map |
| **Concurrency** | `ConcurrentHashMap` bidirectional indexes |
| **Extensibility** | `UrlEncodingStrategy` + `URLRepository` interfaces |
| **Uniqueness** | Probe loop guarantees unique short code in memory |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `ShortURL`, `URLMapping` | model | Mapping record | Codes, URLs, timestamps |
| `Analytics` | model | Usage stats | AtomicLong hits, last access |
| `URLShortenerService` | service | API | shorten, resolve, analytics |
| `URLShortenerServiceImpl` | impl | Business logic | Strategy + repository orchestration |
| `UrlEncodingStrategy` | service | Code generation | encode(counter or hash) |
| `CounterBase62EncodingStrategy` | impl | Sequential IDs | Monotonic counter → Base62 |
| `HashBase62EncodingStrategy` | impl | Content hash | MD5/sha slice → Base62 |
| `Base62Encoder` | impl | Codec | bijective base conversion |
| `URLRepository` | service | Persistence | save, findByShortCode, findByLongUrl |
| `InMemoryURLRepository` | impl | Concurrent maps | short↔long indexes |
| `URLValidator` | impl | Input guard | Scheme/host checks |
| `URLShortener` | orchestrator | Facade | Wires encoding mode |

---

## 5. Relationships

- `URLShortener` **owns** `URLShortenerServiceImpl` with chosen strategy.
- Service **checks** long URL index before creating new mapping.
- Encoding strategy **produces** candidate code; service **probes** on collision.
- Repository **stores** `URLMapping` with embedded `Analytics`.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`UrlEncodingStrategy`) | Counter vs hash without branching service |
| **Repository** (`URLRepository`) | Swap in-memory for Redis/Postgres |
| **Facade** (`URLShortener`) | Single demo constructor with encoding toggle |

---

## 7. Key Implementation Details

### 7.1 Counter vs hash encoding

- **Counter**: global `AtomicLong` — dense codes, reveals volume.
- **Hash**: deterministic per URL — same input same base code; probe on collision with salt.

### 7.2 Idempotent shorten

`repository.findByLongUrl(url)` hit → return existing short code immediately.

### 7.3 Resolve analytics

`mapping.getAnalytics().incrementAccess()` on successful resolve; update last-accessed timestamp.

---

## 8. Likely Follow-Up Q&A

**Q: Distributed ID generation?**  
A: Snowflake IDs or DB sequence shard — counter strategy.

**Q: Hash collision probability?**  
A: Base62 length 7+ makes rare; probing handles remainder.

**Q: Custom short links?**  
A: Reserved word filter + uniqueness check on manual code.

**Q: Expired links?**  
A: TTL field; lazy delete on resolve or sweeper job.

**Q: Rate limit abuse?**  
A: Per-IP rate limiter on shorten API.

**Q: 302 vs 301?**  
A: 302 for analytics accuracy; 301 for permanent SEO.

**Q: Read-heavy scale?**  
A: CDN cache resolve path; write-through to DB.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Counter encoding | O(1) unique; predictable enumeration |
| Hash encoding | No central counter; collision + probing |
| In-memory repo | Fast interview; no durability |
| Linear probe 100 | Bounded loop; fail if saturated |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.urlshortener.URLShortenerDemo"`
