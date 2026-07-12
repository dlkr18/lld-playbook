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
        wal.appendPut(key, value);
        storeLock.writeLock().lock();
        try {
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
        wal.appendDelete(key);
        storeLock.writeLock().lock();
        try {
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
