package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.impl.ConcurrentCache;
import com.you.lld.problems.lrucache.impl.LFUCache;
import com.you.lld.problems.lrucache.impl.LRUCache;
import com.you.lld.problems.lrucache.impl.LoggingCacheListener;
import com.you.lld.problems.lrucache.impl.TtlCache;

import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Interview walkthrough — one scenario per design point.
 *
 *  1. LRU core        — HashMap + DLL, eviction order, Observer, stats
 *  2. LFU             — same Cache API, different victim (Strategy)
 *  3. TTL decorator   — lazy expiration
 *  4. Concurrent      — ReentrantLock decorator, invariant check
 *  5. Stacked         — Concurrent(Ttl(LRU)) composes cleanly
 */
public class LRUCacheDemo {

    public static void main(String[] args) throws Exception {
        lruBasics();
        lfuBasics();
        ttlDecorator();
        concurrentDecorator();
        stackedDecorators();
        System.out.println("\n=== done ===");
    }

    private static void lruBasics() {
        System.out.println("\n── 1. LRU (cap=3) + Observer + stats ──");
        Cache<Integer, String> c = new LRUCache<>(3);
        c.addListener(new LoggingCacheListener<>());

        c.put(1, "one");
        c.put(2, "two");
        c.put(3, "three");
        c.get(1);          // 1 becomes MRU → eviction order is now 2, 3, 1
        c.put(4, "four");  // evicts 2
        c.get(99);         // miss

        System.out.println("  state: " + c);
        System.out.println("  " + c.stats());
    }

    private static void lfuBasics() {
        System.out.println("\n── 2. LFU (cap=3) — frequency beats recency ──");
        Cache<String, Integer> c = new LFUCache<>(3);

        c.put("a", 1);
        c.put("b", 2);
        c.put("c", 3);
        c.get("a"); c.get("a");  // a freq=3
        c.get("b");              // b freq=2, c freq=1
        c.put("d", 4);           // evicts c (lowest freq)

        System.out.println("  a=" + c.containsKey("a")
            + " b=" + c.containsKey("b")
            + " c=" + c.containsKey("c")
            + " d=" + c.containsKey("d"));
    }

    private static void ttlDecorator() throws InterruptedException {
        System.out.println("\n── 3. TTL decorator — lazy expiry ──");
        Cache<String, String> c = new TtlCache<>(new LRUCache<>(10), Duration.ofMillis(200));
        c.addListener(new LoggingCacheListener<>());

        c.put("x", "hello");
        System.out.println("  now:      " + c.get("x"));
        Thread.sleep(250);
        System.out.println("  after TTL: " + c.get("x"));
    }

    private static void concurrentDecorator() throws InterruptedException {
        System.out.println("\n── 4. Concurrent — 4 threads, invariant check ──");
        Cache<Integer, Integer> c = new ConcurrentCache<>(new LRUCache<>(64));
        int threads = 4, opsPerThread = 2_000;

        CountDownLatch go   = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        for (int t = 0; t < threads; t++) {
            new Thread(() -> {
                try { go.await(); } catch (InterruptedException e) { return; }
                ThreadLocalRandom rnd = ThreadLocalRandom.current();
                for (int i = 0; i < opsPerThread; i++) {
                    int key = rnd.nextInt(256);
                    if (rnd.nextBoolean()) c.get(key);
                    else                   c.put(key, i);
                }
                done.countDown();
            }).start();
        }
        go.countDown();
        done.await();

        System.out.println("  size=" + c.size() + " cap=" + c.capacity()
            + " invariant=" + (c.size() <= c.capacity()));
        System.out.println("  " + c.stats());
    }

    private static void stackedDecorators() {
        System.out.println("\n── 5. Stacked — Concurrent(Ttl(LRU)) ──");
        Cache<String, String> c = new ConcurrentCache<>(
            new TtlCache<>(new LRUCache<>(100), Duration.ofSeconds(5))
        );
        c.put("k", "v");
        System.out.println("  get(k) = " + c.get("k"));
        System.out.println("  chain  = " + c);
    }
}
