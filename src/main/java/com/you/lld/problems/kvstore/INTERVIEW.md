# Distributed-ish Key-Value Store (Redis-lite) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

---

## 1. Clarifying Questions (first 5 minutes)

"Design a key-value store" is deliberately huge. I'd bound it fast:

1. **Single node or distributed?** Single-node, in-process for this exercise. I'll
   design the *seams* (persistence, eviction) so sharding/replication bolt on, and
   cover the distributed version in follow-ups.
2. **Value types?** Strings only. Redis's list/set/hash types are a
   `Map<String, RedisObject>` variation on the same skeleton — not the interesting
   part.
3. **Durability expectation?** Survive process restart via a **write-ahead log**,
   not fsync-per-write durability. I'll be explicit that my WAL is in-memory here
   and where the file handle goes.
4. **Bounded memory?** Yes — a `maxEntries` cap with **LRU** eviction. Policy must
   be swappable (LFU, random, TTL-first) without touching the store.
5. **TTL semantics?** Per-key expiry. Lazy expiry on read *plus* a background
   sweeper, because lazy-only leaks keys that are never read again.
6. **Transactions — what isolation?** Redis `MULTI/EXEC` semantics: buffer commands,
   apply on `EXEC`, discard on `DISCARD`. **Not** serializable isolation, no
   rollback of already-applied writes. I'd state this out loud — claiming ACID here
   would be a lie I'd get caught on.
7. **Snapshots?** Point-in-time copy + restore (Redis `BGSAVE`-ish), used for the
   "oh no" button.
8. **Read/write ratio?** Read-heavy — that drives `ReadWriteLock` over
   `synchronized`.

---

## 2. Functional Requirements

- `put(key, value)` / `put(key, value, ttlSeconds)` / `get` / `delete` / `exists`.
- `keys(pattern)` — glob-style prefix/suffix matching (`user:*`).
- **TTL**: keys expire; expired keys are invisible to reads and eventually reclaimed.
- **Eviction**: never exceed `maxEntries`; drop the least-recently-used key.
- **WAL**: every mutation appended before it is applied, so state is replayable.
- **Snapshot**: `createSnapshot()` → id; `restoreSnapshot(id)` rewinds the store.
- **Transactions**: `begin` → buffered `putInTransaction` → `commit` | `rollback`.

## 3. Non-Functional Requirements

- **Thread-safety** under concurrent readers and writers; reads must not serialize
  behind each other.
- **O(1) average** `get`/`put`/`delete`; **O(1)** eviction-victim selection.
- **Bounded memory** — the cap is a hard invariant, not a suggestion.
- **Extensibility** — eviction policy and persistence are interfaces, so LFU or a
  file-backed WAL is a new class, not an edit (OCP).
- **Honesty about durability** — an in-memory WAL buys replay-ordering discipline,
  not crash survival. Say so.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `KeyValue` | model | The stored cell: `key`, `value`, `timestamp`, nullable `ttl`. `isExpired()` = `now > timestamp + ttl`. Mutable by design — it's owned by the store and only touched under the store's lock. |
| `Transaction` | model | `id` + a `Map<String,String>` of buffered changes + `committed` flag. `getChanges()` returns a **copy**, so a commit can't be mutated mid-flight. |
| `Snapshot` | snapshot | Immutable `(id, Map<String,String>)` — a deep-enough copy of live, non-expired data at one instant. |
| `EvictionPolicy` | eviction (interface) | `recordAccess`, `recordInsert`, `remove`, `evictIfNeeded() → victim key or null`, `size`. Knows *nothing* about values — it tracks keys only. |
| `LruEvictionPolicy` | eviction/impl | Access-ordered `LinkedHashMap<String,Boolean>` (`accessOrder=true`). Victim = first key of the iterator = LRU. All methods `synchronized` — it owns its own state. |
| `WriteAheadLog` | persistence | Append-only `List<String>` of `PUT\|k\|v` / `DELETE\|k` lines, `Collections.synchronizedList`. `replay()` returns a snapshot copy. |
| `PersistenceManager` | persistence | Seam for a real file/disk backend. |
| `KVStoreService` | service (interface) | The whole contract. Lets `KVStore` depend on an abstraction — a sharded or networked impl drops in unchanged. |
| `InMemoryKVStore` | service/impl | The engine: `ConcurrentHashMap` store, `ReentrantReadWriteLock`, WAL, eviction policy, TTL sweeper thread, txn + snapshot registries. |
| `KVStore` | root | Thin facade holding one `KVStoreService`. Constructor overloads pick default/bounded/custom impl. |

---

## 5. Relationships

- `KVStore` **has-a** `KVStoreService` (constructor-injected — the testing seam).
- `InMemoryKVStore` **owns** exactly one `EvictionPolicy`, one `WriteAheadLog`, one
  `ReadWriteLock`, and one daemon `ScheduledExecutorService`.
- `store` (`key → KeyValue`) and `evictionPolicy` (`key → recency`) are **parallel
  structures over the same key set**. Every mutation path must touch both or they
  drift — that coupling is the single biggest correctness risk in this design and
  is why all mutations funnel through `putInternal`/`delete`.
- `Transaction` and `Snapshot` are held in their own `ConcurrentHashMap`
  registries, keyed by UUID; both are short-lived and independent of `store`.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `EvictionPolicy`.** "Which key dies when full" is exactly the kind of
  policy that changes per workload (LRU for recency, LFU for hot-key skew,
  TTL-first for caches). Behind an interface, adding LFU is a new file.
  *Alternative:* an `if (policy == LRU)` switch inside the store — rejected: the
  store would need to know every policy's data structure.
- **Facade — `KVStore`.** One front door over engine + config. It delegates
  everything; no logic leaks in.
- **Command / Memento — `Transaction` and `Snapshot`.** `Transaction` buffers
  intended writes as data so they can be discarded (Command); `Snapshot` captures
  opaque state for later restore without exposing internals (Memento).
- **Write-Ahead Log** (not GoF, but the pattern the interviewer wants named):
  record intent **before** applying it, so a replay can reconstruct state. The
  ordering discipline is the point.
- **Dependency Inversion — `KVStoreService`.** `KVStore` never names
  `InMemoryKVStore`. A `ShardedKVStore` implementing the same interface is a drop-in.
- *(Considered, not forced)* **Decorator** for TTL/metrics layering, as in the
  `lrucache` problem. Rejected here because TTL is intrinsic to the cell, not an
  optional wrapper — forcing it would add indirection for one behaviour.

---

## 7. Key Implementation Details

### 7.1 ReadWriteLock over `synchronized` — and why the map is *also* concurrent

```java
private final Map<String, KeyValue> store = new ConcurrentHashMap<>();
private final ReadWriteLock storeLock = new ReentrantReadWriteLock();
```

Two questions an interviewer will fire immediately:

**Why a lock at all if the map is concurrent?** Because several operations are
*composite* and must be atomic across **two** structures. `putInternal` does
`store.put` + `evictionPolicy.recordInsert` + `evictIfNeeded` + `store.remove(victim)`.
`ConcurrentHashMap` makes each call atomic; it cannot make the *sequence* atomic.
Without the write lock, two concurrent puts can both trigger eviction and drop two
victims while the map is at capacity−1, or evict a key that was just inserted.

**Why `ReadWriteLock` and not `synchronized`?** The workload is read-heavy.
`get`/`keys`/`createSnapshot` take the read lock and run **concurrently with each
other**; only `put`/`delete`/`restore`/sweep take the write lock. With
`synchronized`, 20 concurrent readers would serialize for no reason.

### 7.2 TTL: lazy expiry *and* a background sweeper

Lazy-only expiry is the classic wrong answer: a key with a 10-second TTL that
nobody ever reads again occupies memory forever. Redis uses both, so I do too.

```java
ttlCleanupScheduler.scheduleAtFixedRate(this::cleanupExpiredKeys, 30, 30, SECONDS);
```

- **Lazy** (`get`): an expired cell returns `null` and is removed on the spot, so a
  read never sees stale data even between sweeps.
- **Active** (sweeper): every 30s, iterate and drop expired cells under the write
  lock, reclaiming keys nobody reads.
- The scheduler thread is a **daemon** with a named thread factory
  (`kvstore-ttl-cleanup`) — so it never blocks JVM exit, and it's identifiable in a
  thread dump. `shutdown()` stops it deterministically.

Point to raise unprompted: sweeping *all* keys under the write lock is an O(n)
stall. Redis samples ~20 random keys per cycle instead. Fix is bounded batching —
noted in trade-offs.

### 7.3 Transactions buffer; they do not lock

```java
public void putInTransaction(String txnId, String key, String value) {
    Transaction txn = transactions.get(txnId);
    if (txn == null) throw new IllegalArgumentException("unknown or already-finished transaction: " + txnId);
    txn.put(key, value);
}

public void commitTransaction(String txnId) {
    Transaction txn = transactions.get(txnId);
    if (txn != null && !txn.isCommitted()) {
        for (Map.Entry<String, String> e : txn.getChanges().entrySet()) put(e.getKey(), e.getValue());
        txn.commit();
        transactions.remove(txnId);
    }
}
```

- Writes land in the transaction's own map. Until `commit`, `get` sees the **old**
  value — verified in the demo (`Mid-txn (uncommitted) → 100`).
- `rollback` just drops the buffer. Nothing to undo, because nothing was applied.
  That's *why* buffering beats apply-then-undo: undo needs before-images and gets
  hopelessly racy under concurrency.
- **Be honest about the limit:** commit loops over `put()`, each taking the write
  lock separately, so the commit is **not atomic** — a reader can observe a
  half-applied transaction, and this gives no isolation between concurrent
  transactions (last writer wins). Making it atomic = take the write lock **once**
  around the whole loop. Making it *isolated* additionally needs per-key versions
  and an optimistic check at commit (Redis's `WATCH`). I'd name both and implement
  the one-lock fix if asked.

### 7.4 Eviction correctness — the parallel-structure trap

`evictIfNeeded()` returns the victim key; the **store** removes it and logs the
delete:

```java
evictionPolicy.recordInsert(key);
String evicted = evictionPolicy.evictIfNeeded();
if (evicted != null) { store.remove(evicted); wal.appendDelete(evicted); }
```

The policy never holds values and never touches `store` — it's a pure recency
index. That separation is what makes swapping in LFU trivial. The invariant to
state aloud: **every path that adds or removes from `store` must make the matching
call on `evictionPolicy`.** `restoreSnapshot` is the one place this is easy to get
wrong (it clears `store` but only re-inserts into the policy) — a real bug I'd flag
if the interviewer's eye is on it.

---

## 8. Likely Follow-ups (with concise answers)

- **Make it actually durable?** `WriteAheadLog` writes to a `BufferedWriter` over an
  append-mode `FileOutputStream`; `fsync` policy becomes a knob (every write =
  safe/slow, every second = Redis default). On boot, `replay()` re-applies lines in
  order. The interface already exists, so this is one class.
- **Order WAL vs store correctly?** Today `wal.appendPut` happens *before* the write
  lock, so two concurrent puts can hit the log in a different order than the store.
  Move the append **inside** the lock — the log must be a serialization of the
  applied order, or replay diverges.
- **Distribute it?** Consistent hashing over `keyHash → node` with virtual nodes so
  adding a node moves ~1/N of keys instead of rehashing everything. Replication
  factor 3, quorum reads/writes (`R + W > N`) for tunable consistency.
- **Make `keys(pattern)` not O(n)?** Today it's a full scan with a
  `String.matches` per key, recompiling the regex each time. Cheap fix: compile the
  `Pattern` once outside the loop. Real fix for prefix queries: a trie or an
  ordered `ConcurrentSkipListMap` giving `O(log n + k)` range scans. Redis itself
  keeps `KEYS` O(n) and tells you not to use it in production — `SCAN` with a cursor
  is the answer.
- **LFU instead of LRU?** New `EvictionPolicy` impl with a frequency counter +
  min-heap or the O(1) bucketed-DLL scheme from the `lrucache` problem. Zero store
  changes.
- **Hot key / thundering herd?** Single-flight on miss (one loader per key via
  `ConcurrentHashMap.computeIfAbsent`), plus jittered TTLs so a batch of keys
  doesn't expire simultaneously.
- **How do you test the concurrency?** N threads through a `CountDownLatch` start
  gate hammering the same keys, then assert the size cap held and no key exists in
  `store` without a matching policy entry. `KVStoreDemo` demo 5 does the load half;
  the invariant assertions are the missing piece.

---

## 9. Trade-offs

- **`ReadWriteLock` vs `synchronized`:** concurrent reads, at the cost of a
  writer-starvation risk under sustained read load (the lock is non-fair by
  default) and more subtle code. Right call for a read-heavy store.
- **Coarse store-wide lock vs per-key/striped locks:** one lock is simple and
  obviously correct, but every write serializes globally. Striping
  (`lock[hash(key) % 16]`) would scale writes — deferred because eviction and
  snapshot are inherently global operations that would need all stripes anyway.
- **In-memory WAL vs file-backed:** demonstrates the pattern and the ordering
  discipline without file I/O in an interview. Buys **zero** crash durability —
  stated up front rather than implied.
- **Buffered transactions vs true MVCC:** buffering is ~20 lines and gives clean
  rollback; it gives no isolation and a non-atomic commit. MVCC needs per-key
  version chains and a GC story — far past a 90-minute budget.
- **Full-sweep TTL cleanup vs sampled:** simple and complete, but O(n) under the
  write lock every 30s — a latency spike at large N. Redis's sampled approach trades
  completeness for bounded pause; the right fix if the store grows.
- **Mutable `KeyValue` vs immutable cells:** mutation avoids an allocation per
  write, and is safe *only* because access is confined to the store's lock. An
  immutable cell would be safer to share but is unnecessary when nothing escapes.
- **Eviction policy as a pure key index:** clean separation and trivially swappable,
  at the cost of a duplicated key set that two code paths must keep in sync — the
  design's main fragility, worth naming before the interviewer finds it.
