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

