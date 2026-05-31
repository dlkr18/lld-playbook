# kvstore - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/kvstore/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py kvstore`.

## Project Structure (11 files)

```
kvstore/
├── KVStoreDemo.java
├── api/KVStore.java
├── api/KVStoreService.java
├── model/CacheStats.java
├── model/KeyValue.java
├── model/KeyValuePair.java
├── model/Transaction.java
├── impl/InMemoryKVStore.java
├── eviction/EvictionPolicy.java
├── persistence/PersistenceManager.java
├── snapshot/Snapshot.java
```

## Source Code

### `KVStoreDemo.java`

<details>
<summary>Click to view KVStoreDemo.java</summary>

```java
package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.impl.InMemoryKVStore;

import java.util.List;

/**
 * Demo: Key-Value Store with TTL, transactions, snapshots, pattern search.
 */
public class KVStoreDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Key-Value Store Demo ===\n");

        InMemoryKVStore store = new InMemoryKVStore();

        // --- Basic CRUD ---
        System.out.println("--- Basic CRUD ---");
        store.put("user:1:name", "Alice");
        store.put("user:1:email", "alice@example.com");
        store.put("user:2:name", "Bob");

        System.out.println("GET user:1:name = " + store.get("user:1:name"));
        System.out.println("EXISTS user:2:name = " + store.exists("user:2:name"));

        store.delete("user:2:name");
        System.out.println("After delete, EXISTS user:2:name = " + store.exists("user:2:name"));

        // --- Pattern search ---
        System.out.println("\n--- Pattern search ---");
        List<String> userKeys = store.keys("user:1");
        System.out.println("Keys matching 'user:1': " + userKeys);

        // --- TTL ---
        System.out.println("\n--- TTL ---");
        store.put("session:abc", "token-xyz", 1); // 1 second TTL
        System.out.println("GET session:abc = " + store.get("session:abc"));
        System.out.println("Sleeping 1.5 seconds...");
        Thread.sleep(1500);
        System.out.println("GET session:abc (after TTL) = " + store.get("session:abc"));

        // --- Transactions ---
        System.out.println("\n--- Transactions ---");
        store.put("balance:alice", "100");
        store.put("balance:bob", "50");

        String txn = store.beginTransaction();
        System.out.println("Begin transaction: " + txn);
        store.put("balance:alice", "80");  // debit alice
        store.put("balance:bob", "70");    // credit bob
        store.commitTransaction(txn);
        System.out.println("After commit: alice=" + store.get("balance:alice") 
            + ", bob=" + store.get("balance:bob"));

        // Transaction with rollback
        String txn2 = store.beginTransaction();
        store.put("balance:alice", "0");
        System.out.println("During txn: alice=" + store.get("balance:alice"));
        store.rollbackTransaction(txn2);
        System.out.println("After rollback: alice=" + store.get("balance:alice"));

        // --- Snapshots ---
        System.out.println("\n--- Snapshots ---");
        String snapId = store.createSnapshot();
        System.out.println("Created snapshot: " + snapId);
        store.put("balance:alice", "999");
        System.out.println("Modified alice to 999");
        store.restoreSnapshot(snapId);
        System.out.println("After restore: alice=" + store.get("balance:alice"));

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `api/KVStore.java`

<details>
<summary>Click to view api/KVStore.java</summary>

```java
package com.you.lld.problems.kvstore.api;

public interface KVStore<K, V> {
    void put(K key, V value);
    V get(K key);
    void delete(K key);
    boolean contains(K key);
    int size();
}
```

</details>

### `api/KVStoreService.java`

<details>
<summary>Click to view api/KVStoreService.java</summary>

```java
package com.you.lld.problems.kvstore.api;

import com.you.lld.problems.kvstore.model.*;
import com.you.lld.problems.kvstore.snapshot.Snapshot;
import java.util.List;

public interface KVStoreService {
    void put(String key, String value);
    void put(String key, String value, long ttl);
    String get(String key);
    void delete(String key);
    boolean exists(String key);
    List<String> keys(String pattern);
    String beginTransaction();
    void commitTransaction(String txnId);
    void rollbackTransaction(String txnId);
    String createSnapshot();
    void restoreSnapshot(String snapshotId);
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

### `model/KeyValuePair.java`

<details>
<summary>Click to view model/KeyValuePair.java</summary>

```java
package com.you.lld.problems.kvstore.model;

public class KeyValuePair<K, V> {
    private final K key;
    private V value;
    private long timestamp;
    
    public KeyValuePair(K key, V value) {
        this.key = key;
        this.value = value;
        this.timestamp = System.currentTimeMillis();
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
    public long getTimestamp() { return timestamp; }
    
    public void setValue(V value) {
        this.value = value;
        this.timestamp = System.currentTimeMillis();
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

### `impl/InMemoryKVStore.java`

<details>
<summary>Click to view impl/InMemoryKVStore.java</summary>

```java
package com.you.lld.problems.kvstore.impl;

import com.you.lld.problems.kvstore.api.KVStoreService;
import com.you.lld.problems.kvstore.model.*;
import com.you.lld.problems.kvstore.snapshot.Snapshot;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class InMemoryKVStore implements KVStoreService {
    private final Map<String, KeyValue> store = new ConcurrentHashMap<>();
    private final Map<String, Transaction> transactions = new ConcurrentHashMap<>();
    private final Map<String, Snapshot> snapshots = new ConcurrentHashMap<>();
    private final ScheduledExecutorService ttlCleanupScheduler;
    
    public InMemoryKVStore() {
        this.ttlCleanupScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "kvstore-ttl-cleanup");
            t.setDaemon(true);
            return t;
        });
        ttlCleanupScheduler.scheduleAtFixedRate(this::cleanupExpiredKeys, 30, 30, TimeUnit.SECONDS);
    }
    
    private void cleanupExpiredKeys() {
        int removed = 0;
        for (Map.Entry<String, KeyValue> entry : store.entrySet()) {
            if (entry.getValue().isExpired()) {
                store.remove(entry.getKey());
                removed++;
            }
        }
        if (removed > 0) {
            System.out.println("TTL cleanup: removed " + removed + " expired keys");
        }
    }
    
    public void shutdown() {
        ttlCleanupScheduler.shutdown();
        try {
            if (!ttlCleanupScheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                ttlCleanupScheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    @Override
    public void put(String key, String value) {
        KeyValue kv = new KeyValue(key, value);
        store.put(key, kv);
        System.out.println("PUT: " + key + "=" + value);
    }
    
    @Override
    public void put(String key, String value, long ttl) {
        KeyValue kv = new KeyValue(key, value);
        kv.setTtl(ttl);
        store.put(key, kv);
        System.out.println("PUT: " + key + "=" + value + " (TTL: " + ttl + "s)");
    }
    
    @Override
    public String get(String key) {
        KeyValue kv = store.get(key);
        if (kv == null) return null;
        if (kv.isExpired()) {
            store.remove(key);
            return null;
        }
        return kv.getValue();
    }
    
    @Override
    public void delete(String key) {
        store.remove(key);
        System.out.println("DELETE: " + key);
    }
    
    @Override
    public boolean exists(String key) {
        String value = get(key);
        return value != null;
    }
    
    @Override
    public List<String> keys(String pattern) {
        return store.keySet().stream()
            .filter(key -> key.matches(pattern.replace("*", ".*")))
            .collect(Collectors.toList());
    }
    
    @Override
    public String beginTransaction() {
        String txnId = UUID.randomUUID().toString();
        transactions.put(txnId, new Transaction(txnId));
        System.out.println("Transaction started: " + txnId);
        return txnId;
    }
    
    @Override
    public void commitTransaction(String txnId) {
        Transaction txn = transactions.get(txnId);
        if (txn != null && !txn.isCommitted()) {
            for (Map.Entry<String, String> entry : txn.getChanges().entrySet()) {
                put(entry.getKey(), entry.getValue());
            }
            txn.commit();
            System.out.println("Transaction committed: " + txnId);
        }
    }
    
    @Override
    public void rollbackTransaction(String txnId) {
        Transaction txn = transactions.remove(txnId);
        if (txn != null) {
            txn.rollback();
            System.out.println("Transaction rolled back: " + txnId);
        }
    }
    
    @Override
    public String createSnapshot() {
        String snapshotId = UUID.randomUUID().toString();
        Map<String, String> data = store.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getValue()));
        snapshots.put(snapshotId, new Snapshot(snapshotId, data));
        System.out.println("Snapshot created: " + snapshotId);
        return snapshotId;
    }
    
    @Override
    public void restoreSnapshot(String snapshotId) {
        Snapshot snapshot = snapshots.get(snapshotId);
        if (snapshot != null) {
            store.clear();
            for (Map.Entry<String, String> entry : snapshot.getData().entrySet()) {
                put(entry.getKey(), entry.getValue());
            }
            System.out.println("Snapshot restored: " + snapshotId);
        }
    }
}
```

</details>

### `eviction/EvictionPolicy.java`

<details>
<summary>Click to view eviction/EvictionPolicy.java</summary>

```java
package com.you.lld.problems.kvstore.eviction;

public interface EvictionPolicy {
    String evict();
    void recordAccess(String key);
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
