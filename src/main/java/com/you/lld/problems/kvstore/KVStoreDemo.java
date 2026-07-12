package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.service.KVStoreService;
import com.you.lld.problems.kvstore.service.impl.InMemoryKVStore;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo: CRUD, TTL, WAL, LRU eviction, transactions, concurrency.
 */
public class KVStoreDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Key-Value Store Demo ===\n");

        InMemoryKVStore store = new InMemoryKVStore(5);
        try {
            demoBasicCrud(store);
            demoTtl(store);
            demoWalAndEviction(store);
            demoTransactions(store);
            demoConcurrentAccess(store);
        } finally {
            store.shutdown();
        }

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoBasicCrud(KVStoreService store) {
        System.out.println("--- Demo 1: Basic CRUD & pattern search ---");
        store.put("user:1:name", "Alice");
        store.put("user:1:email", "alice@example.com");
        store.put("user:2:name", "Bob");
        System.out.println("GET user:1:name = " + store.get("user:1:name"));
        List<String> keys = store.keys("user:1.*");
        System.out.println("Keys user:1.* → " + keys);
        store.delete("user:2:name");
        System.out.println("EXISTS user:2:name = " + store.exists("user:2:name"));
        System.out.println();
    }

    private static void demoTtl(KVStoreService store) throws InterruptedException {
        System.out.println("--- Demo 2: TTL expiry ---");
        store.put("session:abc", "token-xyz", 1);
        System.out.println("Before expiry: " + store.get("session:abc"));
        Thread.sleep(1100);
        System.out.println("After 1s TTL: " + store.get("session:abc"));
        System.out.println();
    }

    private static void demoWalAndEviction(KVStoreService store) {
        System.out.println("--- Demo 3: WAL + LRU eviction (max=5) ---");
        for (int i = 1; i <= 7; i++) {
            store.put("key-" + i, "val-" + i);
        }
        System.out.println("WAL entries: " + store.walSize());
        System.out.println("key-1 still present? " + store.exists("key-1") + " (LRU evicted)");
        System.out.println("key-7 present? " + store.exists("key-7"));
        System.out.println();
    }

    private static void demoTransactions(KVStoreService store) {
        System.out.println("--- Demo 4: Snapshot & transaction ---");
        store.put("balance:alice", "100");
        String snap = store.createSnapshot();
        store.put("balance:alice", "999");
        System.out.println("Modified alice → " + store.get("balance:alice"));
        store.restoreSnapshot(snap);
        System.out.println("After restore → " + store.get("balance:alice"));

        String txn = store.beginTransaction();
        store.put("balance:alice", "80");
        store.rollbackTransaction(txn);
        System.out.println("After rollback → " + store.get("balance:alice"));
        System.out.println();
    }

    private static void demoConcurrentAccess(KVStoreService store) throws InterruptedException {
        System.out.println("--- Demo 5: Concurrent reads/writes ---");
        int threads = 20;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger reads = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final int n = i;
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        if (n % 2 == 0) {
                            store.put("concurrent:" + n, "v" + n);
                        } else {
                            if (store.get("concurrent:" + (n - 1)) != null) {
                                reads.incrementAndGet();
                            }
                        }
                    } catch (Exception ignored) {
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        start.countDown();
        done.await();
        pool.shutdown();
        System.out.println("Concurrent ops completed, successful reads=" + reads.get());
        System.out.println();
    }
}
