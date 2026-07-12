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
