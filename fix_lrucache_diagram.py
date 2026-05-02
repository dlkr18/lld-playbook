#!/usr/bin/env python3
"""Fix LRU Cache diagram with proper class details."""

diagram_content = """classDiagram

    class LRUCacheImpl {
        -final int capacity
        -final Map~K, CacheNode~ cache
        -final CacheNode~K, V~ head
        -final CacheNode~K, V~ tail
        -final CacheStatistics statistics
        +LRUCacheImpl(capacity)
        +get(key) Optional~V~
        +put(key, value) void
        +size() int
        +capacity() int
        +containsKey(key) boolean
        +clear() void
        +getStatistics() CacheStatistics
        -moveToHead(node) void
        -removeNode(node) void
        -addToHead(node) void
        -removeTail() CacheNode
    }

    class CacheNode~K, V~ {
        +final K key
        +V value
        +CacheNode~K, V~ prev
        +CacheNode~K, V~ next
        +CacheNode(key, value)
        +CacheNode()
        +toString() String
    }

    class LRUCache~K, V~ {
        <<interface>>
        +get(key) Optional~V~
        +put(key, value) void
        +size() int
        +capacity() int
        +containsKey(key) boolean
        +clear() void
        +getStatistics() CacheStatistics
    }

    class Cache~K, V~ {
        <<interface>>
        +get(key) V
        +put(key, value) void
        +remove(key) void
        +clear() void
        +size() int
    }

    class LRUCacheDemo {
        +main(args) static void
    }

    class CacheStatistics {
        -final AtomicLong hits
        -final AtomicLong misses
        -final AtomicLong evictions
        +CacheStatistics()
        +recordHit() void
        +recordMiss() void
        +recordEviction() void
        +getHits() long
        +getMisses() long
        +getEvictions() long
        +getHitRate() double
        +reset() void
    }

    class ConcurrentLRUCache~K, V~ {
        -final LRUCache~K, V~ delegate
        -final ReadWriteLock lock
        +ConcurrentLRUCache(capacity)
        +get(key) Optional~V~
        +put(key, value) void
        +size() int
        +capacity() int
        +containsKey(key) boolean
        +clear() void
        +getStatistics() CacheStatistics
    }

    class CacheEntry~K, V~ {
        -final K key
        -V value
        -long accessTime
        -int accessCount
        +CacheEntry(key, value)
        +access() void
        +getKey() K
        +getValue() V
        +setValue(value) void
        +getAccessTime() long
        +getAccessCount() int
    }

    class EvictionPolicy {
        <<enumeration>>
        LRU
        LFU
        FIFO
    }

    %% Implementation relationships
    LRUCacheImpl ..|> LRUCache : implements
    ConcurrentLRUCache ..|> LRUCache : implements

    %% Composition relationships
    LRUCacheImpl "1" --> "*" CacheNode : uses
    LRUCacheImpl "1" --> "1" CacheStatistics : tracks
    ConcurrentLRUCache "1" --> "1" LRUCache : delegates to
    ConcurrentLRUCache "1" --> "1" CacheStatistics : uses
    CacheEntry --> EvictionPolicy : may use
"""

# Write the fixed diagram
with open('docs/problems/lrucache/diagrams/class-diagram.mmd', 'w', encoding='utf-8') as f:
    f.write(diagram_content)

print("✅ Fixed LRU Cache diagram")
print("   • CacheNode: Added fields (key, value, prev, next)")
print("   • EvictionPolicy: Added enum values (LRU, LFU, FIFO)")
print("   • Cache: Added interface methods")
print("   • LRUCacheImpl: Added implementation arrow to LRUCache")
print("   • ConcurrentLRUCache: Added implementation arrow")
