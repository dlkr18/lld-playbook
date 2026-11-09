# kvstore - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/kvstore/` on 2026-11-09. Re-run `python3 scripts/generate-code-md.py kvstore`.

## Project Structure (12 files)

```
kvstore/
├── KVStoreDemo.java
├── KVStore.java
├── model/CacheStats.java
├── model/KeyValue.java
├── model/Transaction.java
├── service/KVStoreService.java
├── service/impl/InMemoryKVStore.java
├── eviction/EvictionPolicy.java
├── eviction/LruEvictionPolicy.java
├── persistence/PersistenceManager.java
├── persistence/WriteAheadLog.java
├── snapshot/Snapshot.java
```

## Source Code

### `KVStoreDemo.java`

<details>
<summary>Click to view KVStoreDemo.java</summary>

```java
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

        String rolledBack = store.beginTransaction();
        store.putInTransaction(rolledBack, "balance:alice", "80");
        System.out.println("Mid-txn (uncommitted) → " + store.get("balance:alice"));
        store.rollbackTransaction(rolledBack);
        System.out.println("After rollback → " + store.get("balance:alice"));

        String committed = store.beginTransaction();
        store.putInTransaction(committed, "balance:alice", "80");
        store.putInTransaction(committed, "balance:bob", "20");
        store.commitTransaction(committed);
        System.out.println("After commit → alice=" + store.get("balance:alice")
                + " bob=" + store.get("balance:bob"));
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
```

</details>

### `KVStore.java`

<details>
<summary>Click to view KVStore.java</summary>

```java
package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.service.KVStoreService;
import com.you.lld.problems.kvstore.service.impl.InMemoryKVStore;

/**
 * Facade for the key-value store.
 */
public final class KVStore {

    private final KVStoreService service;

    public KVStore() {
        this(new InMemoryKVStore());
    }

    public KVStore(int maxEntries) {
        this(new InMemoryKVStore(maxEntries));
    }

    public KVStore(KVStoreService service) {
        this.service = service;
    }

    public KVStoreService service() {
        return service;
    }
}
```

</details>

### `model/CacheStats.java`

<details>
<summary>Click to view model/CacheStats.java</summary>

```java
package com.you.lld.problems.kvstore.model;

public class CacheStats {
    private long hits;
    private long misses;
    private long evictions;
    
    public void recordHit() {
        hits++;
    }
    
    public void recordMiss() {
        misses++;
    }
    
    public void recordEviction() {
        evictions++;
    }
    
    public double getHitRate() {
        long total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }
    
    public long getHits() { return hits; }
    public long getMisses() { return misses; }
    public long getEvictions() { return evictions; }
}
```

</details>

### `model/KeyValue.java`

<details>
<summary>Click to view model/KeyValue.java</summary>

```java
package com.you.lld.problems.kvstore.model;

import java.time.LocalDateTime;

public class KeyValue {
    private final String key;
    private String value;
    private LocalDateTime timestamp;
    private Long ttl;
    
    public KeyValue(String key, String value) {
        this.key = key;
        this.value = value;
        this.timestamp = LocalDateTime.now();
    }
    
    public void setValue(String value) {
        this.value = value;
        this.timestamp = LocalDateTime.now();
    }
    
    public void setTtl(Long ttl) {
        this.ttl = ttl;
    }
    
    public boolean isExpired() {
        if (ttl == null) return false;
        return LocalDateTime.now().isAfter(timestamp.plusSeconds(ttl));
    }
    
    public String getKey() { return key; }
    public String getValue() { return value; }
    public LocalDateTime getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return key + "=" + value;
    }
}
```

</details>

### `model/Transaction.java`

<details>
<summary>Click to view model/Transaction.java</summary>

```java
package com.you.lld.problems.kvstore.model;

import java.util.*;

public class Transaction {
    private final String id;
    private final Map<String, String> changes;
    private boolean committed;
    
    public Transaction(String id) {
        this.id = id;
        this.changes = new HashMap<>();
        this.committed = false;
    }
    
    public void put(String key, String value) {
        changes.put(key, value);
    }
    
    public void commit() {
        this.committed = true;
    }
    
    public void rollback() {
        changes.clear();
    }
    
    public String getId() { return id; }
    public Map<String, String> getChanges() { return new HashMap<>(changes); }
    public boolean isCommitted() { return committed; }
}
```

</details>

### `service/KVStoreService.java`

<details>
<summary>Click to view service/KVStoreService.java</summary>

```java
package com.you.lld.problems.kvstore.service;

import java.util.List;

public interface KVStoreService {

    void put(String key, String value);

    void put(String key, String value, long ttlSeconds);

    String get(String key);

    void delete(String key);

    boolean exists(String key);

    List<String> keys(String pattern);

    String beginTransaction();

    /** Buffers a write inside the transaction; invisible until commit. */
    void putInTransaction(String txnId, String key, String value);

    void commitTransaction(String txnId);

    void rollbackTransaction(String txnId);

    String createSnapshot();

    void restoreSnapshot(String snapshotId);

    int walSize();

    void shutdown();
}
```

</details>

### `service/impl/InMemoryKVStore.java`

<details>
<summary>Click to view service/impl/InMemoryKVStore.java</summary>

```java
package com.you.lld.problems.kvstore.service.impl;

import com.you.lld.problems.kvstore.eviction.EvictionPolicy;
import com.you.lld.problems.kvstore.eviction.LruEvictionPolicy;
import com.you.lld.problems.kvstore.model.KeyValue;
import com.you.lld.problems.kvstore.model.Transaction;
import com.you.lld.problems.kvstore.persistence.WriteAheadLog;
import com.you.lld.problems.kvstore.service.KVStoreService;
import com.you.lld.problems.kvstore.snapshot.Snapshot;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.stream.Collectors;

/**
 * Thread-safe KV store: WAL durability, TTL, LRU eviction, snapshot/txn support.
 */
public final class InMemoryKVStore implements KVStoreService {

    private final Map<String, KeyValue> store = new ConcurrentHashMap<String, KeyValue>();
    private final Map<String, Transaction> transactions = new ConcurrentHashMap<String, Transaction>();
    private final Map<String, Snapshot> snapshots = new ConcurrentHashMap<String, Snapshot>();
    private final WriteAheadLog wal = new WriteAheadLog();
    private final EvictionPolicy evictionPolicy;
    private final ReadWriteLock storeLock = new ReentrantReadWriteLock();
    private final ScheduledExecutorService ttlCleanupScheduler;

    public InMemoryKVStore() {
        this(1000);
    }

    public InMemoryKVStore(int maxEntries) {
        this.evictionPolicy = new LruEvictionPolicy(maxEntries);
        this.ttlCleanupScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "kvstore-ttl-cleanup");
            t.setDaemon(true);
            return t;
        });
        ttlCleanupScheduler.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                cleanupExpiredKeys();
            }
        }, 30, 30, TimeUnit.SECONDS);
    }

    private void cleanupExpiredKeys() {
        storeLock.writeLock().lock();
        try {
            Iterator<Map.Entry<String, KeyValue>> it = store.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, KeyValue> entry = it.next();
                if (entry.getValue().isExpired()) {
                    it.remove();
                    evictionPolicy.remove(entry.getKey());
                }
            }
        } finally {
            storeLock.writeLock().unlock();
        }
    }

    @Override
    public void shutdown() {
        ttlCleanupScheduler.shutdown();
    }

    @Override
    public void put(String key, String value) {
        putInternal(key, value, null);
    }

    @Override
    public void put(String key, String value, long ttlSeconds) {
        putInternal(key, value, ttlSeconds);
    }

    private void putInternal(String key, String value, Long ttlSeconds) {
        storeLock.writeLock().lock();
        try {
            // WAL append under the same lock as the apply, so replay order == apply order.
            wal.appendPut(key, value);
            KeyValue kv = new KeyValue(key, value);
            if (ttlSeconds != null) {
                kv.setTtl(ttlSeconds);
            }
            store.put(key, kv);
            evictionPolicy.recordInsert(key);
            String evicted = evictionPolicy.evictIfNeeded();
            if (evicted != null) {
                store.remove(evicted);
                wal.appendDelete(evicted);
            }
        } finally {
            storeLock.writeLock().unlock();
        }
    }

    @Override
    public String get(String key) {
        storeLock.readLock().lock();
        try {
            KeyValue kv = store.get(key);
            if (kv == null) {
                return null;
            }
            if (kv.isExpired()) {
                storeLock.readLock().unlock();
                storeLock.writeLock().lock();
                try {
                    // Re-check: a put may have replaced the expired entry while
                    // no lock was held between the read-unlock and write-lock.
                    KeyValue current = store.get(key);
                    if (current == null) {
                        return null;
                    }
                    if (!current.isExpired()) {
                        evictionPolicy.recordAccess(key);
                        return current.getValue();
                    }
                    store.remove(key);
                    evictionPolicy.remove(key);
                    return null;
                } finally {
                    storeLock.readLock().lock();
                    storeLock.writeLock().unlock();
                }
            }
            evictionPolicy.recordAccess(key);
            return kv.getValue();
        } finally {
            storeLock.readLock().unlock();
        }
    }

    @Override
    public void delete(String key) {
        storeLock.writeLock().lock();
        try {
            wal.appendDelete(key);
            store.remove(key);
            evictionPolicy.remove(key);
        } finally {
            storeLock.writeLock().unlock();
        }
    }

    @Override
    public boolean exists(String key) {
        return get(key) != null;
    }

    @Override
    public List<String> keys(String pattern) {
        String regex = pattern.replace("*", ".*");
        storeLock.readLock().lock();
        try {
            List<String> result = new ArrayList<String>();
            for (String key : store.keySet()) {
                KeyValue kv = store.get(key);
                if (kv != null && !kv.isExpired() && key.matches(regex)) {
                    result.add(key);
                }
            }
            return result;
        } finally {
            storeLock.readLock().unlock();
        }
    }

    @Override
    public String beginTransaction() {
        String txnId = UUID.randomUUID().toString();
        transactions.put(txnId, new Transaction(txnId));
        return txnId;
    }

    @Override
    public void putInTransaction(String txnId, String key, String value) {
        Transaction txn = transactions.get(txnId);
        if (txn == null) {
            throw new IllegalArgumentException("unknown or already-finished transaction: " + txnId);
        }
        txn.put(key, value);
    }

    @Override
    public void commitTransaction(String txnId) {
        Transaction txn = transactions.get(txnId);
        if (txn != null && !txn.isCommitted()) {
            for (Map.Entry<String, String> entry : txn.getChanges().entrySet()) {
                put(entry.getKey(), entry.getValue());
            }
            txn.commit();
            transactions.remove(txnId);
        }
    }

    @Override
    public void rollbackTransaction(String txnId) {
        Transaction txn = transactions.remove(txnId);
        if (txn != null) {
            txn.rollback();
        }
    }

    @Override
    public String createSnapshot() {
        storeLock.readLock().lock();
        try {
            String snapshotId = UUID.randomUUID().toString();
            Map<String, String> data = new HashMap<String, String>();
            for (Map.Entry<String, KeyValue> entry : store.entrySet()) {
                if (!entry.getValue().isExpired()) {
                    data.put(entry.getKey(), entry.getValue().getValue());
                }
            }
            snapshots.put(snapshotId, new Snapshot(snapshotId, data));
            return snapshotId;
        } finally {
            storeLock.readLock().unlock();
        }
    }

    @Override
    public void restoreSnapshot(String snapshotId) {
        Snapshot snapshot = snapshots.get(snapshotId);
        if (snapshot == null) {
            return;
        }
        storeLock.writeLock().lock();
        try {
            store.clear();
            for (Map.Entry<String, String> entry : snapshot.getData().entrySet()) {
                KeyValue kv = new KeyValue(entry.getKey(), entry.getValue());
                store.put(entry.getKey(), kv);
                evictionPolicy.recordInsert(entry.getKey());
            }
        } finally {
            storeLock.writeLock().unlock();
        }
    }

    @Override
    public int walSize() {
        return wal.size();
    }
}
```

</details>

### `eviction/EvictionPolicy.java`

<details>
<summary>Click to view eviction/EvictionPolicy.java</summary>

```java
package com.you.lld.problems.kvstore.eviction;

/**
 * Tracks key access order for capacity-based eviction.
 */
public interface EvictionPolicy {

    void recordAccess(String key);

    void recordInsert(String key);

    void remove(String key);

    /** Returns evicted key, or null if under capacity. */
    String evictIfNeeded();

    int size();
}
```

</details>

### `eviction/LruEvictionPolicy.java`

<details>
<summary>Click to view eviction/LruEvictionPolicy.java</summary>

```java
package com.you.lld.problems.kvstore.eviction;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LRU eviction using access-order LinkedHashMap.
 */
public final class LruEvictionPolicy implements EvictionPolicy {

    private final int maxEntries;
    private final LinkedHashMap<String, Boolean> accessOrder;

    public LruEvictionPolicy(int maxEntries) {
        if (maxEntries <= 0) {
            throw new IllegalArgumentException("maxEntries must be positive");
        }
        this.maxEntries = maxEntries;
        this.accessOrder = new LinkedHashMap<String, Boolean>(maxEntries, 0.75f, true);
    }

    @Override
    public synchronized void recordAccess(String key) {
        accessOrder.put(key, Boolean.TRUE);
    }

    @Override
    public synchronized void recordInsert(String key) {
        accessOrder.put(key, Boolean.TRUE);
    }

    @Override
    public synchronized void remove(String key) {
        accessOrder.remove(key);
    }

    @Override
    public synchronized String evictIfNeeded() {
        if (accessOrder.size() <= maxEntries) {
            return null;
        }
        String lru = accessOrder.keySet().iterator().next();
        accessOrder.remove(lru);
        return lru;
    }

    @Override
    public synchronized int size() {
        return accessOrder.size();
    }
}
```

</details>

### `persistence/PersistenceManager.java`

<details>
<summary>Click to view persistence/PersistenceManager.java</summary>

```java
package com.you.lld.problems.kvstore.persistence;

import java.util.Map;

public interface PersistenceManager {
    void save(Map<String, String> data);
    Map<String, String> load();
}
```

</details>

### `persistence/WriteAheadLog.java`

<details>
<summary>Click to view persistence/WriteAheadLog.java</summary>

```java
package com.you.lld.problems.kvstore.persistence;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Append-only write-ahead log for durability. Each line: OP|key|value
 */
public final class WriteAheadLog {

    private final List<String> entries = Collections.synchronizedList(new ArrayList<String>());

    public void appendPut(String key, String value) {
        entries.add("PUT|" + key + "|" + value);
    }

    public void appendDelete(String key) {
        entries.add("DELETE|" + key);
    }

    public List<String> replay() {
        synchronized (entries) {
            return new ArrayList<String>(entries);
        }
    }

    public int size() {
        return entries.size();
    }
}
```

</details>

### `snapshot/Snapshot.java`

<details>
<summary>Click to view snapshot/Snapshot.java</summary>

```java
package com.you.lld.problems.kvstore.snapshot;

import java.time.LocalDateTime;
import java.util.*;

public class Snapshot {
    private final String id;
    private final Map<String, String> data;
    private final LocalDateTime timestamp;
    
    public Snapshot(String id, Map<String, String> data) {
        this.id = id;
        this.data = new HashMap<>(data);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public Map<String, String> getData() { return new HashMap<>(data); }
    public LocalDateTime getTimestamp() { return timestamp; }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.kvstore.KVStoreDemo"
```
