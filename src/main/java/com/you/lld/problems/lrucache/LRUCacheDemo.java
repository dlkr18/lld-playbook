package com.you.lld.problems.lrucache;

/**
 * Demonstration program for LRU Cache functionality.
 * 
 * <p>This program demonstrates:
 * <ul>
 *   <li>Basic cache operations (put, get)</li>
 *   <li>LRU eviction policy</li>
 *   <li>Cache statistics tracking</li>
 *   <li>Thread-safe variant usage</li>
 * </ul>
 */
public class LRUCacheDemo {
    
    public static void main(String[] args) {
        System.out.println("=== LRU Cache Demonstration ===\n");
        
        demoBasicOperations();
        demoEviction();
        demoStatistics();
        demoConcurrentCache();
        
        System.out.println("\n=== All Demonstrations Completed Successfully! ===");
    }
    
    private static void demoBasicOperations() {
        System.out.println("--- Basic Operations ---");
        LRUCache<String, Integer> cache = new LRUCacheImpl<>(3);
        
        cache.put("one", 1);
        cache.put("two", 2);
        cache.put("three", 3);
        
        System.out.println("Cache size: " + cache.size());
        System.out.println("Get 'one': " + cache.get("one"));
        System.out.println("Get 'two': " + cache.get("two"));
        System.out.println("Get 'nonexistent': " + cache.get("nonexistent"));
        System.out.println("Contains 'three': " + cache.containsKey("three"));
        System.out.println();
    }
    
    private static void demoEviction() {
        System.out.println("--- LRU Eviction ---");
        LRUCacheImpl<String, String> cache = new LRUCacheImpl<>(3);
        
        cache.put("A", "Alpha");
        cache.put("B", "Beta");
        cache.put("C", "Gamma");
        System.out.println("Initial: " + cache.getAccessOrder());
        
        cache.get("A"); // Access A, making it most recently used
        System.out.println("After accessing A: " + cache.getAccessOrder());
        
        cache.put("D", "Delta"); // Should evict B (LRU)
        System.out.println("After adding D: " + cache.getAccessOrder());
        System.out.println("B evicted: " + !cache.containsKey("B"));
        System.out.println();
    }
    
    private static void demoStatistics() {
        System.out.println("--- Cache Statistics ---");
        LRUCache<Integer, String> cache = new LRUCacheImpl<>(5);
        
        // Add some data
        for (int i = 0; i < 5; i++) {
            cache.put(i, "Value" + i);
        }
        
        // Generate some hits and misses
        cache.get(0); // Hit
        cache.get(1); // Hit
        cache.get(2); // Hit
        cache.get(10); // Miss
        cache.get(20); // Miss
        
        // Trigger eviction
        cache.put(5, "Value5"); // Evicts 3
        cache.put(6, "Value6"); // Evicts 4
        
        CacheStatistics stats = cache.getStatistics();
        System.out.println("Hits: " + stats.getHits());
        System.out.println("Misses: " + stats.getMisses());
        System.out.println("Evictions: " + stats.getEvictions());
        System.out.println("Hit Rate: " + String.format("%.2f%%", stats.getHitRate() * 100));
        System.out.println();
    }
    
    private static void demoConcurrentCache() {
        System.out.println("--- Thread-Safe Cache ---");
        LRUCache<String, Integer> cache = new ConcurrentLRUCache<>(10);
        
        cache.put("concurrent", 100);
        cache.put("thread-safe", 200);
        
        System.out.println("Get 'concurrent': " + cache.get("concurrent"));
        System.out.println("Get 'thread-safe': " + cache.get("thread-safe"));
        System.out.println("Cache is thread-safe and ready for concurrent access");
        System.out.println();
    }
}

