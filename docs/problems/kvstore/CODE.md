# kvstore - Complete Implementation

## 📁 Project Structure (10 files)

```
kvstore/
├── api/KVStore.java
├── api/KVStoreService.java
├── eviction/EvictionPolicy.java
├── impl/InMemoryKVStore.java
├── model/CacheStats.java
├── model/KeyValue.java
├── model/KeyValuePair.java
├── model/Transaction.java
├── persistence/PersistenceManager.java
├── snapshot/Snapshot.java
```

## 📝 Source Code

### 📄 `api/KVStore.java`

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

### 📄 `api/KVStoreService.java`

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

### 📄 `eviction/EvictionPolicy.java`

```java
package com.you.lld.problems.kvstore.eviction;

public interface EvictionPolicy {
    String evict();
    void recordAccess(String key);
}
```

### 📄 `impl/InMemoryKVStore.java`

```java
package com.you.lld.problems.kvstore.impl;

import com.you.lld.problems.kvstore.api.KVStoreService;
import com.you.lld.problems.kvstore.model.*;
import com.you.lld.problems.kvstore.snapshot.Snapshot;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class InMemoryKVStore implements KVStoreService {
    private final Map<String, KeyValue> store = new ConcurrentHashMap<>();
    private final Map<String, Transaction> transactions = new ConcurrentHashMap<>();
    private final Map<String, Snapshot> snapshots = new ConcurrentHashMap<>();
    
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

### 📄 `model/CacheStats.java`

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

### 📄 `model/KeyValue.java`

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

### 📄 `model/KeyValuePair.java`

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

### 📄 `model/Transaction.java`

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

### 📄 `persistence/PersistenceManager.java`

```java
package com.you.lld.problems.kvstore.persistence;

import java.util.Map;

public interface PersistenceManager {
    void save(Map<String, String> data);
    Map<String, String> load();
}
```

### 📄 `snapshot/Snapshot.java`

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

