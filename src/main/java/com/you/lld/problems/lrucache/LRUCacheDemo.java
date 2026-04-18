package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.impl.ConcurrentCache;
import com.you.lld.problems.lrucache.impl.LFUCache;
import com.you.lld.problems.lrucache.impl.LRUCache;
import com.you.lld.problems.lrucache.impl.LoggingCacheListener;
import com.you.lld.problems.lrucache.impl.TtlCache;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * End-to-end demo for the Cache overhaul:
 *   1. LRU basics + eviction order verification
 *   2. Observer (LoggingCacheListener) wired to see every event
 *   3. LFU behaviour — different victim selection than LRU
 *   4. TTL decorator — lazy expiration on get()
 *   5. Concurrent decorator — thread-safety via ReentrantLock
 *   6. Stacked decorators — Concurrent(Ttl(LRU))
 *   7. Stats snapshot
 *   8. Error cases: null key, null value, zero capacity
 */
public class LRUCacheDemo {

    public static void main(String[] args) throws Exception {
        header("1. LRU basics (capacity=3)");
        Cache<Integer, String> lru = new LRUCache<>(3);
        lru.addListener(new LoggingCacheListener<>());
        lru.put(1, "one");
        lru.put(2, "two");
        lru.put(3, "three");
        System.out.println("   after inserts: " + lru);

        lru.get(1);
        System.out.println("   after get(1):  " + lru + "  // 1 is now MRU");

        lru.put(4, "four");
        System.out.println("   after put(4):  " + lru + "  // 2 was LRU, evicted");

        header("2. Stats snapshot");
        lru.get(3);
        lru.get(99);
        System.out.println("   stats: " + lru.stats());

        header("3. LFU (capacity=3) — frequency dominates recency");
        Cache<String, Integer> lfu = new LFUCache<>(3);
        lfu.addListener(new LoggingCacheListener<>());
        lfu.put("a", 1);
        lfu.put("b", 2);
        lfu.put("c", 3);
        lfu.get("a");
        lfu.get("a");
        lfu.get("b");
        lfu.put("d", 4);
        System.out.println("   expected evict: 'c' (freq=1, oldest in minFreq bucket)");
        System.out.println("   a present? " + lfu.containsKey("a")
            + "  b? " + lfu.containsKey("b")
            + "  c? " + lfu.containsKey("c")
            + "  d? " + lfu.containsKey("d"));

        header("4. TTL decorator (lazy expiration)");
        Cache<String, String> ttl = new TtlCache<>(new LRUCache<String, String>(10), Duration.ofMillis(200));
        ttl.put("alpha", "A");
        ttl.put("beta",  "B");
        System.out.println("   immediately: alpha=" + ttl.get("alpha"));
        Thread.sleep(250);
        System.out.println("   after 250ms: alpha=" + ttl.get("alpha") + "  (expired on read)");

        header("5. Concurrent decorator — 16 threads, 20k ops each");
        concurrentStress();

        header("6. Stacked decorators: Concurrent(Ttl(LRU))");
        Cache<String, String> stacked = new ConcurrentCache<>(
            new TtlCache<>(new LRUCache<String, String>(100), Duration.ofSeconds(1))
        );
        stacked.put("k", "v");
        System.out.println("   stacked lookup: " + stacked.get("k"));
        System.out.println("   description: " + stacked);

        header("7. Error handling");
        safe("null key",         () -> lru.get(null));
        safe("null value",       () -> lru.put(10, null));
        safe("zero capacity",    () -> new LRUCache<Integer, Integer>(0));
        safe("negative capacity",() -> new LRUCache<Integer, Integer>(-5));

        header("8. Bulk fill + hit-rate over skewed access (Zipf-ish)");
        skewedAccessBenchmark();

        System.out.println();
        System.out.println("=== demo complete ===");
    }

    private static void concurrentStress() throws InterruptedException {
        Cache<Integer, Integer> cache = new ConcurrentCache<>(new LRUCache<Integer, Integer>(256));
        int threads = 16;
        int opsPerThread = 20_000;

        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done  = new CountDownLatch(threads);
        AtomicInteger reads = new AtomicInteger();
        AtomicInteger writes = new AtomicInteger();

        for (int t = 0; t < threads; t++) {
            new Thread(() -> {
                try { start.await(); } catch (InterruptedException ignored) { return; }
                ThreadLocalRandom rnd = ThreadLocalRandom.current();
                for (int i = 0; i < opsPerThread; i++) {
                    int key = rnd.nextInt(1024);
                    if (rnd.nextInt(10) < 7) {
                        cache.get(key);
                        reads.incrementAndGet();
                    } else {
                        cache.put(key, i);
                        writes.incrementAndGet();
                    }
                }
                done.countDown();
            }, "worker-" + t).start();
        }

        long t0 = System.nanoTime();
        start.countDown();
        done.await();
        long elapsedMs = (System.nanoTime() - t0) / 1_000_000;

        System.out.println("   reads="  + reads.get() + "  writes=" + writes.get()
            + "  elapsed=" + elapsedMs + "ms");
        System.out.println("   invariant: size() <= capacity()  ->  "
            + cache.size() + " <= " + cache.capacity()
            + "   (" + (cache.size() <= cache.capacity()) + ")");
        System.out.println("   " + cache.stats());
    }

    private static void skewedAccessBenchmark() {
        Cache<Integer, Integer> cache = new LRUCache<>(100);
        int ops = 50_000;
        ThreadLocalRandom rnd = ThreadLocalRandom.current();

        for (int i = 0; i < ops; i++) {
            int key = (int) (Math.pow(rnd.nextDouble(), 2) * 1000);
            Optional<Integer> hit = cache.get(key);
            if (!hit.isPresent()) cache.put(key, i);
        }
        System.out.println("   " + ops + " ops over keyspace 0..999 with x^2 skew");
        System.out.println("   " + cache.stats());
    }

    private static void header(String msg) {
        System.out.println();
        System.out.println("── " + msg + " ──");
    }

    @FunctionalInterface
    private interface ThrowingRunnable { void run() throws Exception; }

    private static void safe(String label, ThrowingRunnable r) {
        try { r.run(); System.out.println("   " + label + ": (no exception — unexpected)"); }
        catch (Exception e) { System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage()); }
    }
}
