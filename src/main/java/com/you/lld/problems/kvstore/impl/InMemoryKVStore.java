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
