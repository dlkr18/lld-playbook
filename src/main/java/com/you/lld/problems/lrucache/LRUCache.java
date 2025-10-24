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

