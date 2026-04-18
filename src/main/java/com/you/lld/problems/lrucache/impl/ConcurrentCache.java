package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Decorator that adds thread safety to any Cache implementation.
 *
 * Why ReentrantLock and NOT ReadWriteLock?
 *
 *   In an LRU/LFU cache, get() mutates internal access metadata (moves a
 *   node to head / bumps a frequency counter). That means every "read"
 *   needs the WRITE lock under ReadWriteLock semantics — so readers end
 *   up serialized anyway, and you pay the extra overhead of RWL's
 *   bookkeeping for zero concurrency benefit. A plain ReentrantLock gives
 *   identical correctness with less code and lower constant factors.
 *
 *   For a read-optimized cache (e.g. no access-order updates on get), a
 *   ReadWriteLock or a StampedLock's optimistic-read path can pay off.
 *   That's a different data structure — and out of scope here.
 *
 * Pure Decorator: every call forwards to the delegate under the lock.
 * Listener events are re-fired by the delegate INSIDE the critical section;
 * listener implementations should therefore be fast (and not call back
 * into the cache, which would deadlock).
 */
public class ConcurrentCache<K, V> implements Cache<K, V> {

    private final Cache<K, V> delegate;
    private final ReentrantLock lock = new ReentrantLock();

    public ConcurrentCache(Cache<K, V> delegate) {
        this.delegate = Objects.requireNonNull(delegate, "delegate");
    }

    @Override
    public Optional<V> get(K key) {
        lock.lock();
        try { return delegate.get(key); } finally { lock.unlock(); }
    }

    @Override
    public void put(K key, V value) {
        lock.lock();
        try { delegate.put(key, value); } finally { lock.unlock(); }
    }

    @Override
    public Optional<V> remove(K key) {
        lock.lock();
        try { return delegate.remove(key); } finally { lock.unlock(); }
    }

    @Override
    public boolean containsKey(K key) {
        lock.lock();
        try { return delegate.containsKey(key); } finally { lock.unlock(); }
    }

    @Override
    public void clear() {
        lock.lock();
        try { delegate.clear(); } finally { lock.unlock(); }
    }

    @Override
    public int size() {
        lock.lock();
        try { return delegate.size(); } finally { lock.unlock(); }
    }

    @Override public int capacity()        { return delegate.capacity(); }
    @Override public CacheStats stats()    { return delegate.stats(); }
    @Override public void addListener(CacheEventListener<K, V> l)    { delegate.addListener(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { delegate.removeListener(l); }

    @Override public String toString() { return "Concurrent(" + delegate + ")"; }
}
