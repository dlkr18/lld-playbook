package com.you.lld.problems.kvstore.eviction;

/**
 * Tracks key access order for capacity-based eviction.
 */
public interface EvictionPolicy {

    void recordAccess(String key);

    void recordInsert(String key);

    void remove(String key);

    /** Returns evicted key, or null if under capacity. */
    String evictIfNeeded();

    int size();
}
