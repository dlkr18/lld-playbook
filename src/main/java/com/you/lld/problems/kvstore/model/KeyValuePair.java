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
