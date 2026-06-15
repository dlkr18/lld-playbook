package com.you.lld.problems.kvstore.eviction;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LRU eviction using access-order LinkedHashMap.
 */
public final class LruEvictionPolicy implements EvictionPolicy {

    private final int maxEntries;
    private final LinkedHashMap<String, Boolean> accessOrder;

    public LruEvictionPolicy(int maxEntries) {
        if (maxEntries <= 0) {
            throw new IllegalArgumentException("maxEntries must be positive");
        }
        this.maxEntries = maxEntries;
        this.accessOrder = new LinkedHashMap<String, Boolean>(maxEntries, 0.75f, true);
    }

    @Override
    public synchronized void recordAccess(String key) {
        accessOrder.put(key, Boolean.TRUE);
    }

    @Override
    public synchronized void recordInsert(String key) {
        accessOrder.put(key, Boolean.TRUE);
    }

    @Override
    public synchronized void remove(String key) {
        accessOrder.remove(key);
    }

    @Override
    public synchronized String evictIfNeeded() {
        if (accessOrder.size() <= maxEntries) {
            return null;
        }
        String lru = accessOrder.keySet().iterator().next();
        accessOrder.remove(lru);
        return lru;
    }

    @Override
    public synchronized int size() {
        return accessOrder.size();
    }
}
