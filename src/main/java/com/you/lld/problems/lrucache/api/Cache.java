package com.you.lld.problems.lrucache.api;

import java.util.Optional;

/**
 * Bounded associative store with a configurable eviction policy.
 *
 * Implementations differ in HOW they decide which entry to evict when the
 * cache is full (LRU, LFU, FIFO, ...), but they all satisfy this contract.
 *
 * Contract:
 *   - Null keys and null values are rejected (IllegalArgumentException).
 *     Reason: `Optional<V>` conveys absence; nulls would be ambiguous.
 *   - get(k) MAY update access metadata used by the eviction policy
 *     (LRU moves the entry to "most recent"; LFU bumps the frequency).
 *   - containsKey(k) is a pure read — it does NOT update access metadata.
 *   - size() never exceeds capacity(). Eviction happens BEFORE the
 *     new entry is inserted when capacity would be exceeded.
 *   - Thread safety is NOT guaranteed by the core implementations.
 *     Wrap with a concurrency decorator (e.g. ConcurrentCache) if needed.
 */
public interface Cache<K, V> {

    /**
     * Returns the value for {@code key} and marks it as recently/frequently used
     * according to the eviction policy. Empty if not present.
     */
    Optional<V> get(K key);

    /**
     * Associates {@code value} with {@code key}, evicting the policy-selected
     * victim if the cache is at capacity. Listeners are notified of the
     * eviction with cause {@link CacheEventListener.EvictionCause#CAPACITY}.
     */
    void put(K key, V value);

    /**
     * Explicit removal. Returns the previous value if present. Listeners are
     * notified via {@link CacheEventListener#onRemove}.
     */
    Optional<V> remove(K key);

    /** Pure presence check; does NOT update access metadata. */
    boolean containsKey(K key);

    /** Remove all entries; fires {@link CacheEventListener#onClear}. */
    void clear();

    int size();
    int capacity();

    /** Immutable snapshot of current stats. */
    CacheStats stats();

    /** Register an observer. Listeners are invoked synchronously. */
    void addListener(CacheEventListener<K, V> listener);

    /** No-op if the listener was never registered. */
    void removeListener(CacheEventListener<K, V> listener);
}
