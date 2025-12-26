package com.you.lld.problems.kvstore.api;

public interface KVStore<K, V> {
    void put(K key, V value);
    V get(K key);
    void delete(K key);
    boolean contains(K key);
    int size();
}
