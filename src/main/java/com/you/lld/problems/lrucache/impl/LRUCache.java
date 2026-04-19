package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheStats;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * O(1) Least-Recently-Used cache.
 *
 * map  : HashMap<K, Node>       — O(1) key lookup
 * list : doubly-linked list     — O(1) move-to-head / remove-tail
 *        head ↔ MRU … LRU ↔ tail   (both are sentinel nodes)
 *
 * NOT thread-safe — wrap with {@link ConcurrentCache}.
 */
public final class LRUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final Node<K, V> head, tail;
    private final List<CacheEventListener<K, V>> listeners = new ArrayList<>();

    private long hits, misses, evictions;

    public LRUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
        this.map = new HashMap<>();
        head = new Node<>(null, null);
        tail = new Node<>(null, null);
        head.next = tail;
        tail.prev = head;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = map.get(key);
        if (node == null) {
            misses++;
            fireEvent(l -> l.onMiss(key));
            return Optional.empty();
        }
        moveToHead(node);
        hits++;
        fireEvent(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNull(key, "key");
        requireNonNull(value, "value");

        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToHead(existing);
            fireEvent(l -> l.onPut(key, value));
            return;
        }

        if (map.size() >= capacity) {
            Node<K, V> victim = tail.prev;
            unlink(victim);
            map.remove(victim.key);
            evictions++;
            fireEvent(l -> l.onEvict(victim.key, victim.value));
        }

        Node<K, V> node = new Node<>(key, value);
        map.put(key, node);
        addAfterHead(node);
        fireEvent(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNull(key, "key");
        Node<K, V> node = map.remove(key);
        if (node == null) return Optional.empty();
        unlink(node);
        fireEvent(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNull(key, "key");
        return map.containsKey(key);
    }

    @Override
    public void clear() {
        map.clear();
        head.next = tail;
        tail.prev = head;
        hits = misses = evictions = 0;
        fireEvent(CacheEventListener::onClear);
    }

    @Override public int size()         { return map.size(); }
    @Override public int capacity()     { return capacity; }
    @Override public CacheStats stats() { return new CacheStats(hits, misses, evictions); }

    @Override public void addListener(CacheEventListener<K, V> l)    { if (l != null) listeners.add(l); }
    @Override public void removeListener(CacheEventListener<K, V> l) { listeners.remove(l); }

    // ── DLL operations ──

    private void moveToHead(Node<K, V> node) {
        unlink(node);
        addAfterHead(node);
    }

    private void unlink(Node<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addAfterHead(Node<K, V> node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    // ── helpers ──

    private void fireEvent(java.util.function.Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) event.accept(l);
    }

    private static void requireNonNull(Object obj, String name) {
        if (obj == null) throw new IllegalArgumentException(name + " cannot be null");
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("LRUCache{cap=").append(capacity).append(", [MRU");
        for (Node<K, V> n = head.next; n != tail; n = n.next) sb.append(" → ").append(n.key);
        return sb.append(" LRU]}").toString();
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        Node<K, V> prev, next;
        Node(K key, V value) { this.key = key; this.value = value; }
    }
}
