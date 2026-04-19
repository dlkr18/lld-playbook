package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.time.Clock;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Decorator that adds per-entry TTL with LAZY expiration.
 *
 * No background thread. Expired entries are cleaned up on the next
 * get() or containsKey(). Call {@link #purgeExpired()} if you want
 * eager cleanup from a scheduled task.
 *
 * NOT thread-safe — compose as {@code new ConcurrentCache<>(new TtlCache<>(...))}.
 */
public final class TtlCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final long ttlMillis;
    private final Clock clock;
    private final Map<K, Long> expiresAt = new HashMap<>();
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    public TtlCache(Cache<K, V> delegate, Duration ttl) {
        this(delegate, ttl, Clock.systemUTC());
    }

    public TtlCache(Cache<K, V> delegate, Duration ttl, Clock clock) {
        this.delegate = Objects.requireNonNull(delegate);
        this.clock = Objects.requireNonNull(clock);
        if (ttl.isNegative() || ttl.isZero()) throw new IllegalArgumentException("ttl must be positive");
        this.ttlMillis = ttl.toMillis();
    }

    @Override
    public Optional<V> get(K key) {
        if (isExpired(key)) {
            evictExpired(key);
            return Optional.empty();
        }
        return delegate.get(key);
    }

    @Override
    public void put(K key, V value) {
        delegate.put(key, value);
        expiresAt.put(key, clock.millis() + ttlMillis);
    }

    @Override
    public Optional<V> remove(K key) {
        expiresAt.remove(key);
        return delegate.remove(key);
    }

    @Override
    public boolean containsKey(K key) {
        if (isExpired(key)) {
            evictExpired(key);
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

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    /** Eagerly drop all expired entries. Returns count purged. */
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

    private void evictExpired(K key) {
        expiresAt.remove(key);
        Optional<V> val = delegate.remove(key);
        val.ifPresent(v -> fireEvent(l -> l.onEvict(key, v)));
    }

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    @Override public String toString() { return "Ttl(" + ttlMillis + "ms, " + delegate + ")"; }
}
