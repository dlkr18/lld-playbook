# lrucache - Complete Implementation

## 📁 Project Structure (10 files)

```
lrucache/
├── CacheNode.java
├── CacheStatistics.java
├── ConcurrentLRUCache.java
├── LRUCache.java
├── LRUCacheDemo.java
├── LRUCacheImpl.java
├── api/Cache.java
├── impl/LRUCache.java
├── model/CacheEntry.java
├── model/EvictionPolicy.java
```

## 📝 Source Code

### 📄 `CacheNode.java`

```java
package com.you.lld.problems.lrucache;

/**
 * Internal node used in the doubly linked list for LRU tracking.
 * 
 * <p>Package-private as this is an implementation detail.
 * Forms a doubly linked list to maintain access order.
 * 
 * @param <K> the type of the key
 * @param <V> the type of the value
 */
class CacheNode<K, V> {
    final K key;
    V value;
    CacheNode<K, V> prev;
    CacheNode<K, V> next;
    
    /**
     * Creates a cache node with the given key and value.
     * 
     * @param key the key (must not be null)
     * @param value the value (must not be null)
     */
    CacheNode(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    /**
     * Creates a sentinel node with null key and value.
     * Used for head and tail sentinels in the doubly linked list.
     */
    CacheNode() {
        this.key = null;
        this.value = null;
    }
    
    @Override
    public String toString() {
        if (key == null) {
            return "SentinelNode";
        }
        return "CacheNode{key=" + key + ", value=" + value + "}";
    }
}

```

### 📄 `CacheStatistics.java`

```java
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

```

### 📄 `ConcurrentLRUCache.java`

```java
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

```

### 📄 `LRUCache.java`

```java
package com.you.lld.problems.lrucache;

import java.util.Optional;

/**
 * A cache that evicts the Least Recently Used (LRU) item when capacity is reached.
 * 
 * <p>Both get and put operations mark an item as "recently used".
 * All operations should complete in O(1) time complexity.
 * 
 * <p>Implementation notes:
 * <ul>
 *   <li>Keys and values cannot be null</li>
 *   <li>Capacity must be positive</li>
 *   <li>Size never exceeds capacity</li>
 *   <li>Thread safety depends on implementation</li>
 * </ul>
 * 
 * @param <K> the type of keys maintained by this cache
 * @param <V> the type of mapped values
 */
public interface LRUCache<K, V> {
    
    /**
     * Retrieves the value associated with the given key.
     * 
     * <p>If the key exists, it is marked as recently used and moved to the
     * front of the access order. If the key doesn't exist, returns empty.
     * 
     * @param key the key whose associated value is to be returned
     * @return an Optional containing the value if found, empty otherwise
     * @throws IllegalArgumentException if key is null
     */
    Optional<V> get(K key);
    
    /**
     * Associates the specified value with the specified key in this cache.
     * 
     * <p>If the cache previously contained a mapping for the key, the old
     * value is replaced and the key is marked as recently used.
     * 
     * <p>If the cache is at capacity and this is a new key, the least
     * recently used item is evicted before inserting the new entry.
     * 
     * @param key the key with which the specified value is to be associated
     * @param value the value to be associated with the specified key
     * @throws IllegalArgumentException if key or value is null
     */
    void put(K key, V value);
    
    /**
     * Returns the number of key-value mappings in this cache.
     * 
     * @return the number of entries in the cache
     */
    int size();
    
    /**
     * Returns the maximum number of entries this cache can hold.
     * 
     * @return the capacity of the cache
     */
    int capacity();
    
    /**
     * Returns true if this cache contains a mapping for the specified key.
     * 
     * <p>Note: This operation does NOT update the access order.
     * Use get() if you want to mark the key as recently used.
     * 
     * @param key the key whose presence is to be tested
     * @return true if this cache contains a mapping for the key
     * @throws IllegalArgumentException if key is null
     */
    boolean containsKey(K key);
    
    /**
     * Removes all entries from this cache.
     * 
     * <p>The cache will be empty after this call returns.
     */
    void clear();
    
    /**
     * Returns statistics about cache usage.
     * 
     * @return cache statistics including hits, misses, and evictions
     */
    CacheStatistics getStatistics();
}

```

### 📄 `LRUCacheDemo.java`

```java
package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.impl.LRUCache;

public class LRUCacheDemo {
    public static void main(String[] args) {
        System.out.println("💾 LRU Cache Demo");
        System.out.println("==================================================================");
        System.out.println();
        
        LRUCache<Integer, String> cache = new LRUCache<>(3);
        
        cache.put(1, "One");
        cache.put(2, "Two");
        cache.put(3, "Three");
        System.out.println("Added 3 items");
        
        System.out.println("Get 1: " + cache.get(1));
        
        cache.put(4, "Four");
        System.out.println("Added 4 (should evict 2)");
        
        System.out.println("Get 2: " + cache.get(2));
        System.out.println("Get 3: " + cache.get(3));
        
        System.out.println("\n✅ Demo complete!");
    }
}
```

### 📄 `LRUCacheImpl.java`

```java
package com.you.lld.problems.lrucache;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Thread-unsafe implementation of LRU Cache using HashMap and Doubly Linked List.
 * 
 * <p>This implementation provides O(1) time complexity for both get and put operations
 * by combining:
 * <ul>
 *   <li>HashMap: for O(1) key lookup</li>
 *   <li>Doubly Linked List: for O(1) insertion/removal and access order tracking</li>
 * </ul>
 * 
 * <p>The doubly linked list maintains access order with:
 * <ul>
 *   <li>Head: Most recently used</li>
 *   <li>Tail: Least recently used</li>
 * </ul>
 * 
 * <p>Design decisions:
 * <ul>
 *   <li>Sentinel nodes (head/tail) simplify edge cases</li>
 *   <li>Null keys and values are rejected for clarity</li>
 *   <li>Statistics tracking is optional and can be disabled</li>
 * </ul>
 * 
 * <p><b>Not thread-safe.</b> Use {@link ConcurrentLRUCache} for concurrent access.
 * 
 * @param <K> the type of keys maintained by this cache
 * @param <V> the type of mapped values
 */
public class LRUCacheImpl<K, V> implements LRUCache<K, V> {
    
    private final int capacity;
    private final Map<K, CacheNode<K, V>> cache;
    private final CacheNode<K, V> head; // Sentinel: most recently used
    private final CacheNode<K, V> tail; // Sentinel: least recently used
    private final CacheStatistics statistics;
    
    /**
     * Constructs an LRU cache with the specified capacity.
     * 
     * @param capacity the maximum number of entries the cache can hold
     * @throws IllegalArgumentException if capacity is not positive
     */
    public LRUCacheImpl(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive: " + capacity);
        }
        
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.statistics = new CacheStatistics();
        
        // Initialize sentinel nodes
        this.head = new CacheNode<>();
        this.tail = new CacheNode<>();
        head.next = tail;
        tail.prev = head;
    }
    
    @Override
    public Optional<V> get(K key) {
        validateKey(key);
        
        CacheNode<K, V> node = cache.get(key);
        if (node == null) {
            statistics.recordMiss();
            return Optional.empty();
        }
        
        // Move to head (most recently used)
        moveToHead(node);
        statistics.recordHit();
        return Optional.of(node.value);
    }
    
    @Override
    public void put(K key, V value) {
        validateKey(key);
        validateValue(value);
        
        CacheNode<K, V> node = cache.get(key);
        
        if (node != null) {
            // Update existing node
            node.value = value;
            moveToHead(node);
        } else {
            // Add new node
            CacheNode<K, V> newNode = new CacheNode<>(key, value);
            cache.put(key, newNode);
            addToHead(newNode);
            
            // Check capacity and evict if necessary
            if (cache.size() > capacity) {
                CacheNode<K, V> lru = removeTail();
                cache.remove(lru.key);
                statistics.recordEviction();
            }
        }
    }
    
    @Override
    public int size() {
        return cache.size();
    }
    
    @Override
    public int capacity() {
        return capacity;
    }
    
    @Override
    public boolean containsKey(K key) {
        validateKey(key);
        return cache.containsKey(key);
    }
    
    @Override
    public void clear() {
        cache.clear();
        head.next = tail;
        tail.prev = head;
        statistics.reset();
    }
    
    @Override
    public CacheStatistics getStatistics() {
        return statistics;
    }
    
    // ==================== Private Helper Methods ====================
    
    /**
     * Moves the given node to the head of the list (most recently used position).
     */
    private void moveToHead(CacheNode<K, V> node) {
        removeNode(node);
        addToHead(node);
    }
    
    /**
     * Removes the given node from the linked list.
     */
    private void removeNode(CacheNode<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    /**
     * Adds the given node right after the head sentinel.
     */
    private void addToHead(CacheNode<K, V> node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
    
    /**
     * Removes and returns the node before the tail sentinel (LRU item).
     */
    private CacheNode<K, V> removeTail() {
        CacheNode<K, V> lru = tail.prev;
        removeNode(lru);
        return lru;
    }
    
    private void validateKey(K key) {
        if (key == null) {
            throw new IllegalArgumentException("Key cannot be null");
        }
    }
    
    private void validateValue(V value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
    }
    
    // ==================== Debug/Testing Methods ====================
    
    /**
     * Returns a string representation of the cache access order.
     * Format: [MRU] -> key1 -> key2 -> ... -> keyN -> [LRU]
     * 
     * <p>Package-private for testing purposes.
     */
    String getAccessOrder() {
        StringBuilder sb = new StringBuilder("[MRU] -> ");
        CacheNode<K, V> current = head.next;
        while (current != tail) {
            sb.append(current.key);
            current = current.next;
            if (current != tail) {
                sb.append(" -> ");
            }
        }
        sb.append(" -> [LRU]");
        return sb.toString();
    }
    
    /**
     * Validates internal consistency of the cache.
     * Useful for testing and debugging.
     * 
     * @throws IllegalStateException if invariants are violated
     */
    void validateInvariants() {
        // Check size consistency
        if (cache.size() > capacity) {
            throw new IllegalStateException(
                "Cache size " + cache.size() + " exceeds capacity " + capacity
            );
        }
        
        // Count nodes in linked list
        int listSize = 0;
        CacheNode<K, V> current = head.next;
        while (current != tail) {
            listSize++;
            current = current.next;
            
            // Prevent infinite loops
            if (listSize > capacity + 1) {
                throw new IllegalStateException("Linked list appears to have a cycle");
            }
        }
        
        // Verify HashMap and LinkedList have same size
        if (listSize != cache.size()) {
            throw new IllegalStateException(
                "HashMap size " + cache.size() + " doesn't match LinkedList size " + listSize
            );
        }
        
        // Verify all HashMap entries are in LinkedList
        for (K key : cache.keySet()) {
            CacheNode<K, V> node = cache.get(key);
            if (node.key == null || !node.key.equals(key)) {
                throw new IllegalStateException(
                    "HashMap key " + key + " doesn't match node key " + node.key
                );
            }
        }
    }
    
    @Override
    public String toString() {
        return String.format(
            "LRUCache{capacity=%d, size=%d, accessOrder=%s}",
            capacity, size(), getAccessOrder()
        );
    }
}

```

### 📄 `api/Cache.java`

```java
package com.you.lld.problems.lrucache.api;

public interface Cache<K, V> {
    V get(K key);
    void put(K key, V value);
    void remove(K key);
    void clear();
    int size();
}
```

### 📄 `impl/LRUCache.java`

```java
package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import java.util.*;

public class LRUCache<K, V> implements Cache<K, V> {
    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final DoublyLinkedList<K, V> list;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.list = new DoublyLinkedList<>();
    }
    
    @Override
    public V get(K key) {
        if (!map.containsKey(key)) {
            return null;
        }
        
        Node<K, V> node = map.get(key);
        list.moveToHead(node);
        return node.value;
    }
    
    @Override
    public void put(K key, V value) {
        if (map.containsKey(key)) {
            Node<K, V> node = map.get(key);
            node.value = value;
            list.moveToHead(node);
        } else {
            if (map.size() >= capacity) {
                Node<K, V> removed = list.removeTail();
                if (removed != null) {
                    map.remove(removed.key);
                }
            }
            
            Node<K, V> newNode = new Node<>(key, value);
            list.addToHead(newNode);
            map.put(key, newNode);
        }
    }
    
    @Override
    public void remove(K key) {
        if (map.containsKey(key)) {
            Node<K, V> node = map.get(key);
            list.remove(node);
            map.remove(key);
        }
    }
    
    @Override
    public void clear() {
        map.clear();
        list.clear();
    }
    
    @Override
    public int size() {
        return map.size();
    }
    
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev;
        Node<K, V> next;
        
        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    
    private static class DoublyLinkedList<K, V> {
        private Node<K, V> head;
        private Node<K, V> tail;
        
        DoublyLinkedList() {
            head = new Node<>(null, null);
            tail = new Node<>(null, null);
            head.next = tail;
            tail.prev = head;
        }
        
        void addToHead(Node<K, V> node) {
            node.next = head.next;
            node.prev = head;
            head.next.prev = node;
            head.next = node;
        }
        
        void remove(Node<K, V> node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        
        void moveToHead(Node<K, V> node) {
            remove(node);
            addToHead(node);
        }
        
        Node<K, V> removeTail() {
            Node<K, V> node = tail.prev;
            if (node == head) {
                return null;
            }
            remove(node);
            return node;
        }
        
        void clear() {
            head.next = tail;
            tail.prev = head;
        }
    }
}
```

### 📄 `model/CacheEntry.java`

```java
package com.you.lld.problems.lrucache.model;

public class CacheEntry<K, V> {
    private final K key;
    private V value;
    private long accessTime;
    private int accessCount;
    
    public CacheEntry(K key, V value) {
        this.key = key;
        this.value = value;
        this.accessTime = System.currentTimeMillis();
        this.accessCount = 0;
    }
    
    public void access() {
        this.accessTime = System.currentTimeMillis();
        this.accessCount++;
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
    public void setValue(V value) { this.value = value; }
    public long getAccessTime() { return accessTime; }
    public int getAccessCount() { return accessCount; }
}
```

### 📄 `model/EvictionPolicy.java`

```java
package com.you.lld.problems.lrucache.model;

public enum EvictionPolicy {
    LRU, LFU, FIFO
}
```

