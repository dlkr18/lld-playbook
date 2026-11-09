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

    @Override public int capacity() { return delegate.capacity(); }

    // stats() reads counters that put/get mutate, and the delegate's listener list is
    // iterated during put/get: both need the same lock, or a concurrent addListener
    // throws ConcurrentModificationException in the writer.
    @Override public CacheStats stats() {
        lock.lock();
        try { return delegate.stats(); } finally { lock.unlock(); }
    }

    @Override public void addListener(CacheEventListener<K, V> l) {
        lock.lock();
        try { delegate.addListener(l); } finally { lock.unlock(); }
    }

    @Override public void removeListener(CacheEventListener<K, V> l) {
        lock.lock();
        try { delegate.removeListener(l); } finally { lock.unlock(); }
    }
    @Override public String toString() { return "Concurrent(" + delegate + ")"; }
}
