# LRU Cache — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an O(1) get/put cache with pluggable eviction policies and optional concurrency/TTL decorators.

---

## 1. Clarifying Questions

- Operations required? (get, put, optional remove, size, stats.)
- Eviction policy default? (LRU; also LFU, FIFO, TTL in repo.)
- Capacity — count or bytes? (Entry count for demo.)
- Thread-safe? (Optional `ConcurrentCache` decorator.)
- TTL per key? (`TtlCache` wrapper evicts on access if expired.)
- Null keys/values? (Typically disallow null keys.)
- Distributed cache? (Out of scope — mention Redis as follow-up.)

---

## 2. Functional Requirements

1. **get(key)** — return value or miss; LRU touches key to MRU end.
2. **put(key, value)** — insert or update; evict LRU when over capacity.
3. **Eviction strategies** — LRU, LFU, FIFO selectable via `Cache` impl.
4. **Stats** — hits, misses, evictions (`CacheStats`).
5. **Events** — optional `CacheEventListener` on evict/hit (Observer).
6. **Decorators** — wrap base cache with TTL, concurrency, logging.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Time complexity** | O(1) get and put for LRU/LFU |
| **Concurrency** | `ConcurrentCache` uses striped locks or `ConcurrentHashMap` + synchronized list ops |
| **Memory** | Bounded by capacity; TTL reduces stale footprint |
| **Extensibility** | `Cache` interface; decorators compose without changing core |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Cache<K,V>` | service | Contract | get, put, remove, size, clear |
| `LRUCache` | impl | LRU eviction | `HashMap` + doubly linked list |
| `LFUCache` | impl | LFU eviction | HashMap + freq buckets + DLL |
| `TtlCache` | impl | Decorator | Wraps cache; expiry map on access |
| `ConcurrentCache` | impl | Decorator | Synchronized delegate |
| `CacheStats` | model | Metrics | Atomic counters |
| `CacheEventListener` | service | Observer | onEvict, onHit, onMiss |
| `LoggingCacheListener` | impl | Demo listener | Logs events |

---

## 5. Relationships

- Decorators **wrap** inner `Cache` — delegate after pre/post logic.
- `LRUCache` **maps** key → list node for O(1) splice move-to-head.
- List **orders** MRU at head, LRU at tail for eviction.
- `LFUCache` **tracks** frequency per key in nested structure.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`Cache` implementations) | Swap LRU/LFU without caller change |
| **Decorator** (`TtlCache`, `ConcurrentCache`) | Compose behaviors vs subclass explosion |
| **Observer** (`CacheEventListener`) | Metrics/logging without polluting hot path |

---

## 7. Key Implementation Details

### 7.1 LRU — HashMap + DLL

- `get`: map lookup → move node to head.
- `put`: if exists update + move; else add head, if size > cap evict tail.
- Map stores key → `Node` reference for O(1) removal.

### 7.2 LFU — O(1) via frequency lists

Min-heap is O(log n); this impl uses `Map<freq, DLL>` + `keyToNode` for O(1) increment/evict minimum frequency LRU among ties.

### 7.3 Decorator TTL

On `get`, if `now > expiry`, remove and return miss. On `put`, set expiry = now + ttl.

---

## 8. Likely Follow-Up Q&A

**Q: Why doubly linked list?**  
A: O(1) removal from middle when moving node to head; singly linked needs prev pointer for eviction.

**Q: Thread-safe LRU?**  
A: Single lock on whole cache (simple) or striped locks per segment (higher throughput).

**Q: Redis LRU difference?**  
A: Redis approximates LRU for memory; exact LRU is this pattern.

**Q: Cache stampede?**  
A: Single-flight lock per key on miss — not in demo, common prod extension.

**Q: Size-based eviction?**  
A: Track byte size per entry in node metadata; evict until under budget.

**Q: LFU aging?**  
A: Decay frequencies periodically to avoid immortal hot keys.

**Q: Weak references?**  
A: `WeakHashMap` for GC-sensitive caches — keys collected under memory pressure.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Exact LRU | Perfect recency; more pointer churn than sampled LRU |
| LFU | Good for skewed access; new keys evicted quickly without aging |
| Decorator chain | Flexible order matters (TTL inside vs outside lock) |
| In-process only | Low latency; no coherence across JVMs |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.lrucache.LRUCacheDemo"`
