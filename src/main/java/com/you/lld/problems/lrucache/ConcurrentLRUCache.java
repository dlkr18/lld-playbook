package com.you.lld.problems.lrucache;

import java.util.Optional;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Thread-safe wrapper for LRU Cache using ReadWriteLock.
 * 
 * <p>This implementation uses the Decorator pattern to add thread-safety
 * to an underlying LRUCache implementation. It uses a ReadWriteLock to allow:
 * <ul>
 *   <li>Multiple concurrent reads (get, containsKey, size)</li>
 *   <li>Exclusive writes (put, clear)</li>
 * </ul>
 * 
 * <p>Design rationale:
 * <ul>
 *   <li>Separates thread-safety concerns from cache logic (SRP)</li>
 *   <li>Allows users to choose based on their concurrency needs</li>
 *   <li>Demonstrates Decorator pattern</li>
 * </ul>
 * 
 * <p>Note: get() requires write lock because it modifies access order.
 * For read-only containsKey(), read lock is sufficient.
 * 
 * @param <K> the type of keys maintained by this cache
 * @param <V> the type of mapped values
 */
public class ConcurrentLRUCache<K, V> implements LRUCache<K, V> {
    
    private final LRUCache<K, V> delegate;
    private final ReadWriteLock lock;
    
    /**
     * Creates a thread-safe LRU cache with the specified capacity.
     * 
     * @param capacity the maximum number of entries the cache can hold
     * @throws IllegalArgumentException if capacity is not positive
     */
    public ConcurrentLRUCache(int capacity) {
        this.delegate = new LRUCacheImpl<>(capacity);
        this.lock = new ReentrantReadWriteLock();
    }
    
    /**
     * Creates a thread-safe wrapper around an existing LRUCache.
     * 
     * <p>Warning: The provided cache should not be accessed directly
     * after wrapping, as it would bypass thread-safety guarantees.
     * 
     * @param cache the cache to wrap
     */
    public ConcurrentLRUCache(LRUCache<K, V> cache) {
        this.delegate = cache;
        this.lock = new ReentrantReadWriteLock();
    }
    
    @Override
    public Optional<V> get(K key) {
        // Write lock needed because get() modifies access order
        lock.writeLock().lock();
        try {
            return delegate.get(key);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Override
    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            delegate.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Override
    public int size() {
        lock.readLock().lock();
        try {
            return delegate.size();
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public int capacity() {
        // Capacity is immutable, no lock needed
        return delegate.capacity();
    }
    
    @Override
    public boolean containsKey(K key) {
        // Read lock sufficient as containsKey doesn't modify access order
        lock.readLock().lock();
        try {
            return delegate.containsKey(key);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public void clear() {
        lock.writeLock().lock();
        try {
            delegate.clear();
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Override
    public CacheStatistics getStatistics() {
        // Statistics are thread-safe internally
        return delegate.getStatistics();
    }
    
    @Override
    public String toString() {
        lock.readLock().lock();
        try {
            return "Concurrent" + delegate.toString();
        } finally {
            lock.readLock().unlock();
        }
    }
}

