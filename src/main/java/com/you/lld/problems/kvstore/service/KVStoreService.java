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

    void commitTransaction(String txnId);

    void rollbackTransaction(String txnId);

    String createSnapshot();

    void restoreSnapshot(String snapshotId);

    int walSize();

    void shutdown();
}
