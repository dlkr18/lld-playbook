# lru-cache - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/lrucache/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py lru-cache`.

## Project Structure (9 files)

```
lrucache/
├── LRUCacheDemo.java
├── api/Cache.java
├── api/CacheEventListener.java
├── api/CacheStats.java
├── impl/ConcurrentCache.java
├── impl/LFUCache.java
├── impl/LRUCache.java
├── impl/LoggingCacheListener.java
├── impl/TtlCache.java
```

## Source Code

### `LRUCacheDemo.java`

<details>
<summary>Click to view LRUCacheDemo.java</summary>

```java
package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.impl.ConcurrentCache;
import com.you.lld.problems.lrucache.impl.LFUCache;
import com.you.lld.problems.lrucache.impl.LRUCache;
import com.you.lld.problems.lrucache.impl.LoggingCacheListener;
import com.you.lld.problems.lrucache.impl.TtlCache;

import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Interview walkthrough — one scenario per design point.
 *
 *  1. LRU core        — HashMap + DLL, eviction order, Observer, stats
 *  2. LFU             — same Cache API, different victim (Strategy)
 *  3. TTL decorator   — lazy expiration
 *  4. Concurrent      — ReentrantLock decorator, invariant check
 *  5. Stacked         — Concurrent(Ttl(LRU)) composes cleanly
 */
public class LRUCacheDemo {

    public static void main(String[] args) throws Exception {
        lruBasics();
        lfuBasics();
        ttlDecorator();
        concurrentDecorator();
        stackedDecorators();
        System.out.println("\n=== done ===");
    }

    private static void lruBasics() {
        System.out.println("\n── 1. LRU (cap=3) + Observer + stats ──");
        Cache<Integer, String> c = new LRUCache<>(3);
        c.addListener(new LoggingCacheListener<>());

        c.put(1, "one");
        c.put(2, "two");
        c.put(3, "three");
        c.get(1);          // 1 becomes MRU → eviction order is now 2, 3, 1
        c.put(4, "four");  // evicts 2
        c.get(99);         // miss

        System.out.println("  state: " + c);
        System.out.println("  " + c.stats());
    }

    private static void lfuBasics() {
        System.out.println("\n── 2. LFU (cap=3) — frequency beats recency ──");
        Cache<String, Integer> c = new LFUCache<>(3);

        c.put("a", 1);
        c.put("b", 2);
        c.put("c", 3);
        c.get("a"); c.get("a");  // a freq=3
        c.get("b");              // b freq=2, c freq=1
        c.put("d", 4);           // evicts c (lowest freq)

        System.out.println("  a=" + c.containsKey("a")
            + " b=" + c.containsKey("b")
            + " c=" + c.containsKey("c")
            + " d=" + c.containsKey("d"));
    }

    private static void ttlDecorator() throws InterruptedException {
        System.out.println("\n── 3. TTL decorator — lazy expiry ──");
        Cache<String, String> c = new TtlCache<>(new LRUCache<>(10), Duration.ofMillis(200));
        c.addListener(new LoggingCacheListener<>());

        c.put("x", "hello");
        System.out.println("  now:      " + c.get("x"));
        Thread.sleep(250);
        System.out.println("  after TTL: " + c.get("x"));
    }

    private static void concurrentDecorator() throws InterruptedException {
        System.out.println("\n── 4. Concurrent — 4 threads, invariant check ──");
        Cache<Integer, Integer> c = new ConcurrentCache<>(new LRUCache<>(64));
        int threads = 4, opsPerThread = 2_000;

        CountDownLatch go   = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        for (int t = 0; t < threads; t++) {
            new Thread(() -> {
                try { go.await(); } catch (InterruptedException e) { return; }
                ThreadLocalRandom rnd = ThreadLocalRandom.current();
                for (int i = 0; i < opsPerThread; i++) {
                    int key = rnd.nextInt(256);
                    if (rnd.nextBoolean()) c.get(key);
                    else                   c.put(key, i);
                }
                done.countDown();
            }).start();
        }
        go.countDown();
        done.await();

        System.out.println("  size=" + c.size() + " cap=" + c.capacity()
            + " invariant=" + (c.size() <= c.capacity()));
        System.out.println("  " + c.stats());
    }

    private static void stackedDecorators() {
        System.out.println("\n── 5. Stacked — Concurrent(Ttl(LRU)) ──");
        Cache<String, String> c = new ConcurrentCache<>(
            new TtlCache<>(new LRUCache<>(100), Duration.ofSeconds(5))
        );
        c.put("k", "v");
        System.out.println("  get(k) = " + c.get("k"));
        System.out.println("  chain  = " + c);
    }
}
```

</details>

### `api/Cache.java`

<details>
<summary>Click to view api/Cache.java</summary>

```java
package com.you.lld.problems.lrucache.api;

import java.util.Optional;

/**
 * Bounded key-value store with a pluggable eviction policy.
 *
 * Implementations decide HOW to pick a victim (LRU, LFU, FIFO …)
 * but all satisfy this contract:
 *   - Null keys / values → IllegalArgumentException.
 *   - get() updates access metadata (LRU moves to head, LFU bumps freq).
 *   - containsKey() does NOT update metadata (pure read).
 *   - size() never exceeds capacity(); eviction happens before insert.
 *   - NOT thread-safe by default — wrap with ConcurrentCache.
 */
public interface Cache<K, V> {

    Optional<V> get(K key);

    void put(K key, V value);

    Optional<V> remove(K key);

    boolean containsKey(K key);

    void clear();

    int size();

    int capacity();

    CacheStats stats();

    void addListener(CacheEventListener<K, V> listener);

    void removeListener(CacheEventListener<K, V> listener);
}
```

</details>

### `api/CacheEventListener.java`

<details>
<summary>Click to view api/CacheEventListener.java</summary>

```java
package com.you.lld.problems.lrucache.api;

/**
 * Observer for cache lifecycle events.
 *
 * All methods are default so listeners can override only what they need.
 * Keep implementations fast — they run synchronously on the hot path.
 */
public interface CacheEventListener<K, V> {

    default void onPut(K key, V value) {}

    default void onHit(K key, V value) {}

    default void onMiss(K key) {}

    /** Cache evicted this entry (capacity full or TTL expired). */
    default void onEvict(K key, V value) {}

    /** User explicitly called remove(). */
    default void onRemove(K key, V value) {}

    default void onClear() {}
}
```

</details>

### `api/CacheStats.java`

<details>
<summary>Click to view api/CacheStats.java</summary>

```java
package com.you.lld.problems.lrucache.api;

/** Immutable snapshot of cache counters. */
public final class CacheStats {

    private final long hits;
    private final long misses;
    private final long evictions;

    public CacheStats(long hits, long misses, long evictions) {
        this.hits = hits;
        this.misses = misses;
        this.evictions = evictions;
    }

    public long hits()      { return hits; }
    public long misses()    { return misses; }
    public long evictions() { return evictions; }

    public double hitRate() {
        long total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }

    @Override
    public String toString() {
        return String.format("CacheStats{hits=%d, misses=%d, evictions=%d, hitRate=%.1f%%}",
            hits, misses, evictions, hitRate() * 100);
    }
}
```

</details>

### `impl/ConcurrentCache.java`

<details>
<summary>Click to view impl/ConcurrentCache.java</summary>

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Decorator that makes any {@link Cache} thread-safe.
 *
 * Uses ReentrantLock, NOT ReadWriteLock — because get() in LRU/LFU
 * mutates internal state (moves node / bumps freq), so every "read"
 * would need the write lock anyway, making RWL overhead pointless.
 */
public final class ConcurrentCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final ReentrantLock lock = new ReentrantLock();

    public ConcurrentCache(Cache<K, V> delegate) {
        this.delegate = Objects.requireNonNull(delegate);
    }

    @Override public Optional<V> get(K key) {
        lock.lock();
        try { return delegate.get(key); } finally { lock.unlock(); }
    }

    @Override public void put(K key, V value) {
        lock.lock();
        try { delegate.put(key, value); } finally { lock.unlock(); }
    }

    @Override public Optional<V> remove(K key) {
        lock.lock();
        try { return delegate.remove(key); } finally { lock.unlock(); }
    }

    @Override public boolean containsKey(K key) {
        lock.lock();
        try { return delegate.containsKey(key); } finally { lock.unlock(); }
    }

    @Override public void clear() {
        lock.lock();
        try { delegate.clear(); } finally { lock.unlock(); }
    }

    @Override public int size() {
        lock.lock();
        try { return delegate.size(); } finally { lock.unlock(); }
    }

    @Override public int capacity()     { return delegate.capacity(); }
    @Override public CacheStats stats() { return delegate.stats(); }
    @Override public void addListener(CacheEventListener<K, V> l)    { delegate.addListener(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { delegate.removeListener(l); }
    @Override public String toString() { return "Concurrent(" + delegate + ")"; }
}
```

</details>

### `impl/LFUCache.java`

<details>
<summary>Click to view impl/LFUCache.java</summary>

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * O(1) Least-Frequently-Used cache.
 *
 * keyToNode   : HashMap<K, Node>                         — O(1) lookup
 * freqBuckets : HashMap<Integer, LinkedHashSet<Node>>    — one bucket per frequency;
 *               LinkedHashSet gives O(1) add/remove AND preserves insertion order
 *               (acts as LRU tiebreaker within the same frequency).
 * minFreq     : tracks the lowest frequency — eviction target.
 *
 * NOT thread-safe — wrap with {@link ConcurrentCache}.
 */
public final class LFUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> keyToNode = new HashMap<>();
    private final Map<Integer, LinkedHashSet<Node<K, V>>> freqBuckets = new HashMap<>();
    private int minFreq;
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    private long hits, misses, evictions;

    public LFUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = keyToNode.get(key);
        if (node == null) {
            misses++;
            fireEvent(l -> l.onMiss(key));
            return Optional.empty();
        }
        bumpFrequency(node);
        hits++;
        fireEvent(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNull(key, "key");
        requireNonNull(value, "value");

        Node<K, V> existing = keyToNode.get(key);
        if (existing != null) {
            existing.value = value;
            bumpFrequency(existing);
            fireEvent(l -> l.onPut(key, value));
            return;
        }

        if (keyToNode.size() >= capacity) evictOne();

        Node<K, V> node = new Node<>(key, value, 1);
        keyToNode.put(key, node);
        freqBuckets.computeIfAbsent(1, f -> new LinkedHashSet<>()).add(node);
        minFreq = 1;
        fireEvent(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = keyToNode.remove(key);
        if (node == null) return Optional.empty();
        removeFromBucket(node);
        fireEvent(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNull(key, "key");
        return keyToNode.containsKey(key);
    }

    @Override
    public void clear() {
        keyToNode.clear();
        freqBuckets.clear();
        minFreq = 0;
        hits = misses = evictions = 0;
        fireEvent(CacheEventListener::onClear);
    }

    @Override public int size()         { return keyToNode.size(); }
    @Override public int capacity()     { return capacity; }
    @Override public CacheStats stats() { return new CacheStats(hits, misses, evictions); }

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    // ── internals ──

    private void bumpFrequency(Node<K, V> node) {
        int oldFreq = node.freq;
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(oldFreq);
        bucket.remove(node);
        if (bucket.isEmpty()) {
            freqBuckets.remove(oldFreq);
            if (minFreq == oldFreq) minFreq++;
        }
        node.freq++;
        freqBuckets.computeIfAbsent(node.freq, f -> new LinkedHashSet<>()).add(node);
    }

    private void evictOne() {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(minFreq);
        Node<K, V> victim = bucket.iterator().next();
        bucket.remove(victim);
        if (bucket.isEmpty()) freqBuckets.remove(minFreq);
        keyToNode.remove(victim.key);
        evictions++;
        fireEvent(l -> l.onEvict(victim.key, victim.value));
    }

    private void removeFromBucket(Node<K, V> node) {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(node.freq);
        if (bucket != null) {
            bucket.remove(node);
            if (bucket.isEmpty()) freqBuckets.remove(node.freq);
        }
    }

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    private static void requireNonNull(Object obj, String name) {
        if (obj == null) throw new IllegalArgumentException(name + " cannot be null");
    }

    @Override
    public String toString() {
        return "LFUCache{cap=" + capacity + ", size=" + keyToNode.size() + ", minFreq=" + minFreq + "}";
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        int freq;
        Node(K key, V value, int freq) { this.key = key; this.value = value; this.freq = freq; }
    }
}
```

</details>

### `impl/LRUCache.java`

<details>
<summary>Click to view impl/LRUCache.java</summary>

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * O(1) Least-Recently-Used cache.
 *
 * map  : HashMap<K, Node>       — O(1) key lookup
 * list : doubly-linked list     — O(1) move-to-head / remove-tail
 *        head ↔ MRU … LRU ↔ tail   (both are sentinel nodes)
 *
 * NOT thread-safe — wrap with {@link ConcurrentCache}.
 */
public final class LRUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final Node<K, V> head, tail;
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    private long hits, misses, evictions;

    public LRUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
        this.map = new HashMap<>();
        head = new Node<>(null, null);
        tail = new Node<>(null, null);
        head.next = tail;
        tail.prev = head;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = map.get(key);
        if (node == null) {
            misses++;
            fireEvent(l -> l.onMiss(key));
            return Optional.empty();
        }
        moveToHead(node);
        hits++;
        fireEvent(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNull(key, "key");
        requireNonNull(value, "value");

        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToHead(existing);
            fireEvent(l -> l.onPut(key, value));
            return;
        }

        if (map.size() >= capacity) {
            Node<K, V> victim = tail.prev;
            unlink(victim);
            map.remove(victim.key);
            evictions++;
            fireEvent(l -> l.onEvict(victim.key, victim.value));
        }

        Node<K, V> node = new Node<>(key, value);
        map.put(key, node);
        addAfterHead(node);
        fireEvent(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = map.remove(key);
        if (node == null) return Optional.empty();
        unlink(node);
        fireEvent(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNull(key, "key");
        return map.containsKey(key);
    }

    @Override
    public void clear() {
        map.clear();
        head.next = tail;
        tail.prev = head;
        hits = misses = evictions = 0;
        fireEvent(CacheEventListener::onClear);
    }

    @Override public int size()         { return map.size(); }
    @Override public int capacity()     { return capacity; }
    @Override public CacheStats stats() { return new CacheStats(hits, misses, evictions); }

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    // ── DLL operations ──

    private void moveToHead(Node<K, V> node) {
        unlink(node);
        addAfterHead(node);
    }

    private void unlink(Node<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addAfterHead(Node<K, V> node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    // ── helpers ──

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    private static void requireNonNull(Object obj, String name) {
        if (obj == null) throw new IllegalArgumentException(name + " cannot be null");
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("LRUCache{cap=").append(capacity).append(", [MRU");
        for (Node<K, V> n = head.next; n != tail; n = n.next) sb.append(" → ").append(n.key);
        return sb.append(" LRU]}").toString();
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        Node<K, V> prev, next;
        Node(K key, V value) { this.key = key; this.value = value; }
    }
}
```

</details>

### `impl/LoggingCacheListener.java`

<details>
<summary>Click to view impl/LoggingCacheListener.java</summary>

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.CacheEventListener;

/** Prints cache events to stdout. Swap for a metrics listener in production. */
public final class LoggingCacheListener<K, V> implements CacheEventListener<K, V> {

    @Override public void onPut(K key, V value)    { log("PUT    " + key + " = " + value); }
    @Override public void onHit(K key, V value)    { log("HIT    " + key + " → " + value); }
    @Override public void onMiss(K key)            { log("MISS   " + key); }
    @Override public void onEvict(K key, V value)  { log("EVICT  " + key); }
    @Override public void onRemove(K key, V value) { log("REMOVE " + key); }
    @Override public void onClear()                { log("CLEAR"); }

    private void log(String msg) { System.out.println("  [cache] " + msg); }
}
```

</details>

### `impl/TtlCache.java`

<details>
<summary>Click to view impl/TtlCache.java</summary>

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.time.Clock;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Decorator that adds per-entry TTL with LAZY expiration.
 *
 * No background thread. Expired entries are cleaned up on the next
 * get() or containsKey(). Call {@link #purgeExpired()} if you want
 * eager cleanup from a scheduled task.
 *
 * NOT thread-safe — compose as {@code new ConcurrentCache<>(new TtlCache<>(...))}.
 */
public final class TtlCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final long ttlMillis;
    private final Clock clock;
    private final Map<K, Long> expiresAt = new HashMap<>();
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    public TtlCache(Cache<K, V> delegate, Duration ttl) {
        this(delegate, ttl, Clock.systemUTC());
    }

    public TtlCache(Cache<K, V> delegate, Duration ttl, Clock clock) {
        this.delegate = Objects.requireNonNull(delegate);
        this.clock = Objects.requireNonNull(clock);
        if (ttl.isNegative() || ttl.isZero()) throw new IllegalArgumentException("ttl must be positive");
        this.ttlMillis = ttl.toMillis();
    }

    @Override
    public Optional<V> get(K key) {
        if (isExpired(key)) {
            evictExpired(key);
            return Optional.empty();
        }
        return delegate.get(key);
    }

    @Override
    public void put(K key, V value) {
        delegate.put(key, value);
        expiresAt.put(key, clock.millis() + ttlMillis);
    }

    @Override
    public Optional<V> remove(K key) {
        expiresAt.remove(key);
        return delegate.remove(key);
    }

    @Override
    public boolean containsKey(K key) {
        if (isExpired(key)) {
            evictExpired(key);
            return false;
        }
        return delegate.containsKey(key);
    }

    @Override
    public void clear() {
        expiresAt.clear();
        delegate.clear();
    }

    @Override public int size()         { return delegate.size(); }
    @Override public int capacity()     { return delegate.capacity(); }
    @Override public CacheStats stats() { return delegate.stats(); }

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    /** Eagerly drop all expired entries. Returns count purged. */
    public int purgeExpired() {
        long now = clock.millis();
        int purged = 0;
        Iterator<Map.Entry<K, Long>> it = expiresAt.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<K, Long> e = it.next();
            if (e.getValue() <= now) {
                it.remove();
                delegate.remove(e.getKey());
                purged++;
            }
        }
        return purged;
    }

    private boolean isExpired(K key) {
        Long exp = expiresAt.get(key);
        return exp != null && clock.millis() >= exp;
    }

    private void evictExpired(K key) {
        expiresAt.remove(key);
        Optional<V> val = delegate.remove(key);
        val.ifPresent(v -> fireEvent(l -> l.onEvict(key, v)));
    }

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    @Override public String toString() { return "Ttl(" + ttlMillis + "ms, " + delegate + ")"; }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.lrucache.LRUCacheDemo"
```
