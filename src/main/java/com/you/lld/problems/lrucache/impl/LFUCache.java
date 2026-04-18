package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheEventListener.EvictionCause;
import com.you.lld.problems.lrucache.api.CacheStats;
import com.you.lld.problems.lrucache.api.CacheStatsRecorder;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

/**
 * Canonical O(1) Least-Frequently-Used cache (LeetCode 460 style).
 *
 * Data structures:
 *   keyToNode    : HashMap<K, Node>            -> O(1) key lookup
 *   freqBuckets  : HashMap<Integer, LinkedHashSet<Node>>
 *                                              -> each freq has a bucket;
 *                                                 LinkedHashSet gives O(1) add/remove
 *                                                 AND preserves LRU order within a
 *                                                 frequency (tiebreaker).
 *   minFreq      : smallest frequency currently populated -> O(1) eviction
 *
 * Eviction target: a node with freq == minFreq, specifically the oldest in
 * that bucket (first element of the LinkedHashSet).
 *
 * Every operation stays O(1):
 *   get    : node lookup -> bump freq -> O(1) bucket move
 *   put    : new insert or update-and-bump -> O(1) bucket move; maybe O(1) evict
 *   remove : O(1) unlink from bucket, unlink from keyToNode
 *
 * NOT thread-safe. Wrap with ConcurrentCache.
 */
public class LFUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> keyToNode = new HashMap<>();
    private final Map<Integer, LinkedHashSet<Node<K, V>>> freqBuckets = new HashMap<>();
    private int minFreq = 0;

    private final CacheStatsRecorder stats = new CacheStatsRecorder();
    private final CopyOnWriteArrayList<CacheEventListener<K, V>> listeners = new CopyOnWriteArrayList<>();

    public LFUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be positive: " + capacity);
        this.capacity = capacity;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNullKey(key);
        Node<K, V> node = keyToNode.get(key);
        if (node == null) {
            stats.recordMiss();
            fire(l -> l.onMiss(key));
            return Optional.empty();
        }
        bumpFrequency(node);
        stats.recordHit();
        fire(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNullKey(key);
        if (value == null) throw new IllegalArgumentException("value cannot be null");

        Node<K, V> existing = keyToNode.get(key);
        if (existing != null) {
            existing.value = value;
            bumpFrequency(existing);
            fire(l -> l.onPut(key, value));
            return;
        }

        if (keyToNode.size() >= capacity) {
            evictOne();
        }

        Node<K, V> fresh = new Node<>(key, value, 1);
        keyToNode.put(key, fresh);
        bucketFor(1).add(fresh);
        minFreq = 1;
        fire(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNullKey(key);
        Node<K, V> node = keyToNode.remove(key);
        if (node == null) return Optional.empty();
        removeFromBucket(node);
        fire(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNullKey(key);
        return keyToNode.containsKey(key);
    }

    @Override
    public void clear() {
        keyToNode.clear();
        freqBuckets.clear();
        minFreq = 0;
        stats.reset();
        fire(CacheEventListener::onClear);
    }

    @Override public int size()            { return keyToNode.size(); }
    @Override public int capacity()        { return capacity; }
    @Override public CacheStats stats()    { return stats.snapshot(); }
    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    private void bumpFrequency(Node<K, V> node) {
        int oldFreq = node.freq;
        LinkedHashSet<Node<K, V>> oldBucket = freqBuckets.get(oldFreq);
        oldBucket.remove(node);
        if (oldBucket.isEmpty()) {
            freqBuckets.remove(oldFreq);
            if (minFreq == oldFreq) minFreq++;
        }
        node.freq = oldFreq + 1;
        bucketFor(node.freq).add(node);
    }

    private void evictOne() {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(minFreq);
        if (bucket == null || bucket.isEmpty()) return;
        Node<K, V> victim = bucket.iterator().next();
        bucket.remove(victim);
        if (bucket.isEmpty()) freqBuckets.remove(minFreq);
        keyToNode.remove(victim.key);
        stats.recordEviction();
        fire(l -> l.onEvict(victim.key, victim.value, EvictionCause.CAPACITY));
    }

    private void removeFromBucket(Node<K, V> node) {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(node.freq);
        if (bucket != null) {
            bucket.remove(node);
            if (bucket.isEmpty()) {
                freqBuckets.remove(node.freq);
                if (minFreq == node.freq) recomputeMinFreq();
            }
        }
    }

    private void recomputeMinFreq() {
        if (freqBuckets.isEmpty()) { minFreq = 0; return; }
        int m = Integer.MAX_VALUE;
        for (Integer k : freqBuckets.keySet()) if (k < m) m = k;
        minFreq = m;
    }

    private LinkedHashSet<Node<K, V>> bucketFor(int freq) {
        LinkedHashSet<Node<K, V>> b = freqBuckets.get(freq);
        if (b == null) {
            b = new LinkedHashSet<>();
            freqBuckets.put(freq, b);
        }
        return b;
    }

    private void fire(Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) {
            try { event.accept(l); } catch (Exception ignored) { }
        }
    }

    private static void requireNonNullKey(Object key) {
        if (key == null) throw new IllegalArgumentException("key cannot be null");
    }

    @Override public String toString() {
        return "LFUCache{capacity=" + capacity + ", size=" + keyToNode.size() + ", minFreq=" + minFreq + "}";
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        int freq;
        Node(K key, V value, int freq) { this.key = key; this.value = value; this.freq = freq; }
    }
}
