package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * O(1) Least-Frequently-Used cache.
 *
 * keyToNode   : HashMap<K, Node>                         — O(1) lookup
 * freqBuckets : HashMap<Integer, LinkedHashSet<Node>>    — one bucket per frequency;
 *               LinkedHashSet gives O(1) add/remove AND preserves insertion order
 *               (acts as LRU tiebreaker within the same frequency).
 * minFreq     : tracks the lowest frequency — eviction target.
 *
 * NOT thread-safe — wrap with {@link ConcurrentCache}.
 */
public final class LFUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> keyToNode = new HashMap<>();
    private final Map<Integer, LinkedHashSet<Node<K, V>>> freqBuckets = new HashMap<>();
    private int minFreq;
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    private long hits, misses, evictions;

    public LFUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = keyToNode.get(key);
        if (node == null) {
            misses++;
            fireEvent(l -> l.onMiss(key));
            return Optional.empty();
        }
        bumpFrequency(node);
        hits++;
        fireEvent(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNull(key, "key");
        requireNonNull(value, "value");

        Node<K, V> existing = keyToNode.get(key);
        if (existing != null) {
            existing.value = value;
            bumpFrequency(existing);
            fireEvent(l -> l.onPut(key, value));
            return;
        }

        if (keyToNode.size() >= capacity) evictOne();

        Node<K, V> node = new Node<>(key, value, 1);
        keyToNode.put(key, node);
        freqBuckets.computeIfAbsent(1, f -> new LinkedHashSet<>()).add(node);
        minFreq = 1;
        fireEvent(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = keyToNode.remove(key);
        if (node == null) return Optional.empty();
        removeFromBucket(node);
        fireEvent(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNull(key, "key");
        return keyToNode.containsKey(key);
    }

    @Override
    public void clear() {
        keyToNode.clear();
        freqBuckets.clear();
        minFreq = 0;
        hits = misses = evictions = 0;
        fireEvent(CacheEventListener::onClear);
    }

    @Override public int size()         { return keyToNode.size(); }
    @Override public int capacity()     { return capacity; }
    @Override public CacheStats stats() { return new CacheStats(hits, misses, evictions); }

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    // ── internals ──

    private void bumpFrequency(Node<K, V> node) {
        int oldFreq = node.freq;
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(oldFreq);
        bucket.remove(node);
        if (bucket.isEmpty()) {
            freqBuckets.remove(oldFreq);
            if (minFreq == oldFreq) minFreq++;
        }
        node.freq++;
        freqBuckets.computeIfAbsent(node.freq, f -> new LinkedHashSet<>()).add(node);
    }

    private void evictOne() {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(minFreq);
        Node<K, V> victim = bucket.iterator().next();
        bucket.remove(victim);
        if (bucket.isEmpty()) freqBuckets.remove(minFreq);
        keyToNode.remove(victim.key);
        evictions++;
        fireEvent(l -> l.onEvict(victim.key, victim.value));
    }

    private void removeFromBucket(Node<K, V> node) {
        LinkedHashSet<Node<K, V>> bucket = freqBuckets.get(node.freq);
        if (bucket != null) {
            bucket.remove(node);
            if (bucket.isEmpty()) freqBuckets.remove(node.freq);
        }
    }

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    private static void requireNonNull(Object obj, String name) {
        if (obj == null) throw new IllegalArgumentException(name + " cannot be null");
    }

    @Override
    public String toString() {
        return "LFUCache{cap=" + capacity + ", size=" + keyToNode.size() + ", minFreq=" + minFreq + "}";
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        int freq;
        Node(K key, V value, int freq) { this.key = key; this.value = value; this.freq = freq; }
    }
}
