package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.time.Clock;
import java.time.Duration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Decorator that layers per-entry TTL on top of any Cache.
 *
 * Strategy: LAZY expiration. We don't run a background sweeper; instead,
 * every get/containsKey call first checks whether the entry has expired
 * and, if so, removes it from the delegate and fires an EXPIRED eviction
 * event. This keeps the decorator allocation-free in the steady state
 * and trivially thread-safe when composed under ConcurrentCache.
 *
 * Trade-off: expired entries still occupy space until they are next
 * probed. For a more eager sweep, register a ScheduledExecutorService
 * to call {@link #purgeExpired()} periodically.
 *
 * Composition order matters. For thread safety wrap this way:
 *   new ConcurrentCache<>(new TtlCache<>(new LRUCache<>(n), ttl));
 */
public class TtlCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final Duration ttl;
    private final Clock clock;
    private final Map<K, Long> expiresAt;

    public TtlCache(Cache<K, V> delegate, Duration ttl) {
        this(delegate, ttl, Clock.systemUTC());
    }

    public TtlCache(Cache<K, V> delegate, Duration ttl, Clock clock) {
        this.delegate = Objects.requireNonNull(delegate, "delegate");
        this.ttl = Objects.requireNonNull(ttl, "ttl");
        this.clock = Objects.requireNonNull(clock, "clock");
        if (ttl.isNegative() || ttl.isZero()) throw new IllegalArgumentException("ttl must be positive");
        this.expiresAt = new HashMap<>();
    }

    @Override
    public Optional<V> get(K key) {
        if (isExpired(key)) {
            expireAndFire(key);
            return Optional.empty();
        }
        return delegate.get(key);
    }

    @Override
    public void put(K key, V value) {
        delegate.put(key, value);
        expiresAt.put(key, clock.millis() + ttl.toMillis());
    }

    @Override
    public Optional<V> remove(K key) {
        expiresAt.remove(key);
        return delegate.remove(key);
    }

    @Override
    public boolean containsKey(K key) {
        if (isExpired(key)) {
            expireAndFire(key);
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
    @Override public void addListener(CacheEventListener<K, V> l)    { delegate.addListener(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { delegate.removeListener(l); }

    /** Iterate the expiration map and drop any entries whose TTL has elapsed. */
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

    private void expireAndFire(K key) {
        expiresAt.remove(key);
        delegate.remove(key);
    }

    @Override public String toString() { return "Ttl(" + ttl + " on " + delegate + ")"; }
}
