package com.you.lld.problems.lrucache.api;

/**
 * Observer for cache lifecycle events.
 *
 * Default methods make every hook optional — listeners override only what
 * they care about (e.g. a metrics listener may implement only onHit/onMiss).
 *
 * Distinction that matters in an interview:
 *   - onEvict : the CACHE decided to drop the entry (capacity or TTL)
 *   - onRemove: the USER called remove(k) or replaced the key via put(k, new)
 *
 * Keep listeners fast. The core cache calls them synchronously on the hot path.
 */
public interface CacheEventListener<K, V> {

    enum EvictionCause {
        /** Cache was full; the policy selected this victim. */
        CAPACITY,
        /** Entry's TTL elapsed. */
        EXPIRED
    }

    default void onPut(K key, V value) {}
    default void onHit(K key, V value) {}
    default void onMiss(K key) {}
    default void onEvict(K key, V value, EvictionCause cause) {}
    default void onRemove(K key, V value) {}
    default void onClear() {}
}
