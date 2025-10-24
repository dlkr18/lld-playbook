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

