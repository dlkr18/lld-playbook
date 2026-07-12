package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Decorator that makes any {@link Cache} thread-safe.
 *
 * Uses ReentrantLock, NOT ReadWriteLock — because get() in LRU/LFU
 * mutates internal state (moves node / bumps freq), so every "read"
 * would need the write lock anyway, making RWL overhead pointless.
 */
public final class ConcurrentCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final ReentrantLock lock = new ReentrantLock();

    public ConcurrentCache(Cache<K, V> delegate) {
        this.delegate = Objects.requireNonNull(delegate);
    }

    @Override public Optional<V> get(K key) {
        lock.lock();
        try { return delegate.get(key); } finally { lock.unlock(); }
    }

    @Override public void put(K key, V value) {
        lock.lock();
        try { delegate.put(key, value); } finally { lock.unlock(); }
    }

    @Override public Optional<V> remove(K key) {
        lock.lock();
        try { return delegate.remove(key); } finally { lock.unlock(); }
    }

    @Override public boolean containsKey(K key) {
        lock.lock();
        try { return delegate.containsKey(key); } finally { lock.unlock(); }
    }

    @Override public void clear() {
        lock.lock();
        try { delegate.clear(); } finally { lock.unlock(); }
    }

    @Override public int size() {
        lock.lock();
        try { return delegate.size(); } finally { lock.unlock(); }
    }

    @Override public int capacity()     { return delegate.capacity(); }
    @Override public CacheStats stats() { return delegate.stats(); }
    @Override public void addListener(CacheEventListener<K, V> l)    { delegate.addListener(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { delegate.removeListener(l); }
    @Override public String toString() { return "Concurrent(" + delegate + ")"; }
}
