package com.you.lld.problems.lrucache.model;

public class CacheEntry<K, V> {
    private final K key;
    private V value;
    private long accessTime;
    private int accessCount;
    
    public CacheEntry(K key, V value) {
        this.key = key;
        this.value = value;
        this.accessTime = System.currentTimeMillis();
        this.accessCount = 0;
    }
    
    public void access() {
        this.accessTime = System.currentTimeMillis();
        this.accessCount++;
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
    public void setValue(V value) { this.value = value; }
    public long getAccessTime() { return accessTime; }
    public int getAccessCount() { return accessCount; }
}
