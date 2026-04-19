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
