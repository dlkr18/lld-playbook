package com.you.lld.problems.lrucache;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Thread-safety tests for ConcurrentLRUCache.
 * 
 * <p>Tests concurrent access patterns:
 * <ul>
 *   <li>Concurrent reads</li>
 *   <li>Concurrent writes</li>
 *   <li>Mixed read-write operations</li>
 *   <li>Race conditions and data integrity</li>
 * </ul>
 */
@DisplayName("Concurrent LRU Cache Tests")
class ConcurrentLRUCacheTest {
    
    @Test
    @DisplayName("Should handle concurrent puts from multiple threads")
    void shouldHandleConcurrentPuts() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(1000);
        int numThreads = 10;
        int operationsPerThread = 100;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        for (int t = 0; t < numThreads; t++) {
            int threadId = t;
            executor.submit(() -> {
                try {
                    for (int i = 0; i < operationsPerThread; i++) {
                        int key = threadId * operationsPerThread + i;
                        cache.put(key, "value" + key);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        assertTrue(cache.size() <= cache.capacity());
        assertTrue(cache.size() > 0);
    }
    
    @Test
    @DisplayName("Should handle concurrent gets from multiple threads")
    void shouldHandleConcurrentGets() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(100);
        
        // Populate cache
        for (int i = 0; i < 100; i++) {
            cache.put(i, "value" + i);
        }
        
        int numThreads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        
        for (int t = 0; t < numThreads; t++) {
            executor.submit(() -> {
                try {
                    for (int i = 0; i < 100; i++) {
                        Optional<String> value = cache.get(i % 100);
                        if (value.isPresent()) {
                            successCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        assertTrue(successCount.get() > 0, "Should have successful gets");
    }
    
    @Test
    @DisplayName("Should handle mixed concurrent reads and writes")
    void shouldHandleMixedConcurrentReadsAndWrites() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(500);
        int numThreads = 20;
        int operationsPerThread = 100;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        for (int t = 0; t < numThreads; t++) {
            int threadId = t;
            executor.submit(() -> {
                try {
                    ThreadLocalRandom random = ThreadLocalRandom.current();
                    for (int i = 0; i < operationsPerThread; i++) {
                        int key = random.nextInt(1000);
                        
                        if (random.nextBoolean()) {
                            // Write operation
                            cache.put(key, "value" + key + "-" + threadId);
                        } else {
                            // Read operation
                            cache.get(key);
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        assertTrue(cache.size() <= cache.capacity());
    }
    
    @Test
    @DisplayName("Should maintain size invariant under concurrent access")
    void shouldMaintainSizeInvariantUnderConcurrentAccess() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(100);
        int numThreads = 10;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        for (int t = 0; t < numThreads; t++) {
            executor.submit(() -> {
                try {
                    for (int i = 0; i < 200; i++) {
                        cache.put(i, "value" + i);
                        assertTrue(cache.size() <= cache.capacity(), 
                            "Size exceeded capacity");
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        assertEquals(100, cache.size());
    }
    
    @Test
    @DisplayName("Should not lose data with concurrent updates to same key")
    void shouldNotLoseDataWithConcurrentUpdatesToSameKey() throws InterruptedException {
        ConcurrentLRUCache<String, AtomicInteger> cache = new ConcurrentLRUCache<>(10);
        String key = "counter";
        cache.put(key, new AtomicInteger(0));
        
        int numThreads = 10;
        int incrementsPerThread = 1000;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        for (int t = 0; t < numThreads; t++) {
            executor.submit(() -> {
                try {
                    for (int i = 0; i < incrementsPerThread; i++) {
                        cache.get(key).ifPresent(AtomicInteger::incrementAndGet);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        Optional<AtomicInteger> result = cache.get(key);
        assertTrue(result.isPresent());
        assertEquals(numThreads * incrementsPerThread, result.get().get());
    }
    
    @Test
    @DisplayName("Should handle concurrent clear operations")
    void shouldHandleConcurrentClearOperations() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(100);
        
        ExecutorService executor = Executors.newFixedThreadPool(4);
        CountDownLatch latch = new CountDownLatch(4);
        
        // Thread 1: Continuous puts
        executor.submit(() -> {
            try {
                for (int i = 0; i < 1000; i++) {
                    cache.put(i, "value" + i);
                    Thread.sleep(1);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Thread 2: Continuous gets
        executor.submit(() -> {
            try {
                for (int i = 0; i < 1000; i++) {
                    cache.get(i % 100);
                    Thread.sleep(1);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Thread 3 & 4: Occasional clears
        for (int t = 0; t < 2; t++) {
            executor.submit(() -> {
                try {
                    for (int i = 0; i < 5; i++) {
                        Thread.sleep(50);
                        cache.clear();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(15, TimeUnit.SECONDS);
        executor.shutdown();
        
        // Just verify no exceptions occurred
        assertTrue(cache.size() <= cache.capacity());
    }
    
    @RepeatedTest(5)
    @DisplayName("Should maintain consistency under stress (repeated)")
    void shouldMaintainConsistencyUnderStress() throws InterruptedException {
        ConcurrentLRUCache<Integer, Integer> cache = new ConcurrentLRUCache<>(50);
        int numThreads = 20;
        int operations = 100;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        List<Future<?>> futures = new ArrayList<>();
        
        for (int t = 0; t < numThreads; t++) {
            Future<?> future = executor.submit(() -> {
                ThreadLocalRandom random = ThreadLocalRandom.current();
                for (int i = 0; i < operations; i++) {
                    int key = random.nextInt(100);
                    int operation = random.nextInt(3);
                    
                    switch (operation) {
                        case 0:
                            cache.put(key, key * 2);
                            break;
                        case 1:
                            cache.get(key);
                            break;
                        case 2:
                            cache.containsKey(key);
                            break;
                    }
                }
            });
            futures.add(future);
        }
        
        // Wait for all tasks to complete
        for (Future<?> future : futures) {
            assertDoesNotThrow(() -> future.get(10, TimeUnit.SECONDS));
        }
        
        executor.shutdown();
        
        assertTrue(cache.size() <= cache.capacity());
        assertTrue(cache.size() >= 0);
    }
    
    @Test
    @DisplayName("Should provide accurate statistics under concurrent access")
    void shouldProvideAccurateStatisticsUnderConcurrentAccess() throws InterruptedException {
        ConcurrentLRUCache<Integer, String> cache = new ConcurrentLRUCache<>(100);
        
        // Populate some data
        for (int i = 0; i < 50; i++) {
            cache.put(i, "value" + i);
        }
        
        int numThreads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        for (int t = 0; t < numThreads; t++) {
            executor.submit(() -> {
                try {
                    for (int i = 0; i < 100; i++) {
                        cache.get(i % 75); // Some hits, some misses
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        executor.shutdown();
        
        CacheStatistics stats = cache.getStatistics();
        long totalRequests = stats.getHits() + stats.getMisses();
        
        assertEquals(1000, totalRequests, "Should record all requests");
        assertTrue(stats.getHits() > 0, "Should have hits");
        assertTrue(stats.getMisses() > 0, "Should have misses");
        assertTrue(stats.getHitRate() > 0.0 && stats.getHitRate() <= 1.0);
    }
    
    @Test
    @DisplayName("Should work correctly with basic operations")
    void shouldWorkCorrectlyWithBasicOperations() {
        ConcurrentLRUCache<String, Integer> cache = new ConcurrentLRUCache<>(3);
        
        cache.put("one", 1);
        cache.put("two", 2);
        cache.put("three", 3);
        
        assertEquals(Optional.of(1), cache.get("one"));
        assertEquals(Optional.of(2), cache.get("two"));
        assertEquals(Optional.of(3), cache.get("three"));
        
        cache.put("four", 4); // Should evict "one"
        
        assertEquals(Optional.empty(), cache.get("one"));
        assertEquals(Optional.of(4), cache.get("four"));
    }
}

