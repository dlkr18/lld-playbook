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
