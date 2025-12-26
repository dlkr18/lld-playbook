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
