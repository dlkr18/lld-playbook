package com.you.lld.problems.lrucache;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Tracks cache performance metrics.
 * 
 * <p>Thread-safe implementation using atomic operations.
 * Provides insights into cache effectiveness through hit rate calculations.
 */
public class CacheStatistics {
    private final AtomicLong hits = new AtomicLong(0);
    private final AtomicLong misses = new AtomicLong(0);
    private final AtomicLong evictions = new AtomicLong(0);
    
    /**
     * Records a cache hit (successful get operation).
     */
    void recordHit() {
        hits.incrementAndGet();
    }
    
    /**
     * Records a cache miss (get operation returned empty).
     */
    void recordMiss() {
        misses.incrementAndGet();
    }
    
    /**
     * Records an eviction (item removed due to capacity).
     */
    void recordEviction() {
        evictions.incrementAndGet();
    }
    
    /**
     * Returns the total number of cache hits.
     * 
     * @return the hit count
     */
    public long getHits() {
        return hits.get();
    }
    
    /**
     * Returns the total number of cache misses.
     * 
     * @return the miss count
     */
    public long getMisses() {
        return misses.get();
    }
    
    /**
     * Returns the total number of evictions.
     * 
     * @return the eviction count
     */
    public long getEvictions() {
        return evictions.get();
    }
    
    /**
     * Calculates the cache hit rate.
     * 
     * @return hit rate as a percentage (0.0 to 1.0), or 0.0 if no requests
     */
    public double getHitRate() {
        long totalRequests = hits.get() + misses.get();
        if (totalRequests == 0) {
            return 0.0;
        }
        return (double) hits.get() / totalRequests;
    }
    
    /**
     * Resets all statistics to zero.
     */
    void reset() {
        hits.set(0);
        misses.set(0);
        evictions.set(0);
    }
    
    @Override
    public String toString() {
        return String.format(
            "CacheStatistics{hits=%d, misses=%d, evictions=%d, hitRate=%.2f%%}",
            getHits(), getMisses(), getEvictions(), getHitRate() * 100
        );
    }
}

