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
