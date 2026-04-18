package com.you.lld.problems.lrucache.api;

import java.util.concurrent.atomic.LongAdder;

/**
 * Internal counter used by Cache implementations to build a CacheStats snapshot.
 *
 * Uses LongAdder (not AtomicLong) for write-heavy concurrent updates; LongAdder
 * shards the counter under contention. Read cost (sum()) is slightly higher
 * but stats() is called rarely.
 *
 * Package-public on purpose: implementations across the impl package share it.
 */
public final class CacheStatsRecorder {

    private final LongAdder hits      = new LongAdder();
    private final LongAdder misses    = new LongAdder();
    private final LongAdder evictions = new LongAdder();

    public void recordHit()       { hits.increment(); }
    public void recordMiss()      { misses.increment(); }
    public void recordEviction()  { evictions.increment(); }

    public CacheStats snapshot() {
        return new CacheStats(hits.sum(), misses.sum(), evictions.sum());
    }

    public void reset() {
        hits.reset();
        misses.reset();
        evictions.reset();
    }
}
