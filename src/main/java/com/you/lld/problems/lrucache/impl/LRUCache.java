package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.api.CacheEventListener.EvictionCause;
import com.you.lld.problems.lrucache.api.CacheStats;
import com.you.lld.problems.lrucache.api.CacheStatsRecorder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

/**
 * Canonical O(1) Least-Recently-Used cache.
 *
 * Data structures:
 *   map   : HashMap<K, Node>            -> O(1) key lookup
 *   list  : doubly-linked list          -> O(1) moveToHead / removeTail
 *           head sentinel <-> MRU ... LRU <-> tail sentinel
 *
 * Every read/write is O(1):
 *   get:    map.get, unlink, re-link at head          -> O(1)
 *   put:    map.get or new Node; moveToHead; maybe evict tail -> O(1)
 *   remove: map.remove + unlink                        -> O(1)
 *
 * NOT thread-safe. Wrap with ConcurrentCache if multi-threaded.
 * The sentinel node trick removes the null checks on head/tail updates
 * that would otherwise clutter the code.
 */
public class LRUCache<K, V> implements Cache<K, V> {

    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final Node<K, V> head;
    private final Node<K, V> tail;
    private final CacheStatsRecorder stats = new CacheStatsRecorder();
    private final CopyOnWriteArrayList<CacheEventListener<K, V>> listeners = new CopyOnWriteArrayList<>();

    public LRUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be positive: " + capacity);
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node<>(null, null);
        this.tail = new Node<>(null, null);
        head.next = tail;
        tail.prev = head;
    }

    @Override
    public Optional<V> get(K key) {
        requireNonNullKey(key);
        Node<K, V> node = map.get(key);
        if (node == null) {
            stats.recordMiss();
            fire(l -> l.onMiss(key));
            return Optional.empty();
        }
        moveToHead(node);
        stats.recordHit();
        fire(l -> l.onHit(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        requireNonNullKey(key);
        if (value == null) throw new IllegalArgumentException("value cannot be null");

        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToHead(existing);
            fire(l -> l.onPut(key, value));
            return;
        }

        if (map.size() >= capacity) {
            Node<K, V> victim = tail.prev;
            unlink(victim);
            map.remove(victim.key);
            stats.recordEviction();
            fire(l -> l.onEvict(victim.key, victim.value, EvictionCause.CAPACITY));
        }

        Node<K, V> fresh = new Node<>(key, value);
        map.put(key, fresh);
        addAfterHead(fresh);
        fire(l -> l.onPut(key, value));
    }

    @Override
    public Optional<V> remove(K key) {
        requireNonNullKey(key);
        Node<K, V> node = map.remove(key);
        if (node == null) return Optional.empty();
        unlink(node);
        fire(l -> l.onRemove(key, node.value));
        return Optional.of(node.value);
    }

    @Override
    public boolean containsKey(K key) {
        requireNonNullKey(key);
        return map.containsKey(key);
    }

    @Override
    public void clear() {
        map.clear();
        head.next = tail;
        tail.prev = head;
        stats.reset();
        fire(CacheEventListener::onClear);
    }

    @Override public int size()     { return map.size(); }
    @Override public int capacity() { return capacity; }
    @Override public CacheStats stats() { return stats.snapshot(); }

    @Override public void addListener(CacheEventListener<K, V> listener) {
        if (listener != null) listeners.add(listener);
    }

    @Override public void removeListener(CacheEventListener<K, V> listener) {
        listeners.remove(listener);
    }

    /** For debugging / tests. Package-visible. */
    String accessOrder() {
        StringBuilder sb = new StringBuilder("[MRU] -> ");
        Node<K, V> cur = head.next;
        while (cur != tail) {
            sb.append(cur.key);
            cur = cur.next;
            if (cur != tail) sb.append(" -> ");
        }
        sb.append(" -> [LRU]");
        return sb.toString();
    }

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

    private void fire(Consumer<CacheEventListener<K, V>> event) {
        for (CacheEventListener<K, V> l : listeners) {
            try { event.accept(l); } catch (Exception ignored) { /* isolate listener failures */ }
        }
    }

    private static void requireNonNullKey(Object key) {
        if (key == null) throw new IllegalArgumentException("key cannot be null");
    }

    @Override public String toString() {
        return "LRUCache{capacity=" + capacity + ", size=" + map.size() + ", order=" + accessOrder() + "}";
    }

    private static final class Node<K, V> {
        final K key;
        V value;
        Node<K, V> prev;
        Node<K, V> next;
        Node(K key, V value) { this.key = key; this.value = value; }
    }
}
