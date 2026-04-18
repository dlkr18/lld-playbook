package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.CacheEventListener;

/**
 * Prints every cache lifecycle event to stdout.
 * Useful for demos; in production swap for a metrics-emitting listener.
 */
public class LoggingCacheListener<K, V> implements CacheEventListener<K, V> {

    @Override public void onPut(K key, V value)    { System.out.println("[cache] PUT " + key + " = " + value); }
    @Override public void onHit(K key, V value)    { System.out.println("[cache] HIT " + key + " -> " + value); }
    @Override public void onMiss(K key)            { System.out.println("[cache] MISS " + key); }
    @Override public void onRemove(K key, V value) { System.out.println("[cache] REMOVE " + key); }
    @Override public void onClear()                { System.out.println("[cache] CLEAR"); }

    @Override public void onEvict(K key, V value, EvictionCause cause) {
        System.out.println("[cache] EVICT " + key + " (" + cause + ")");
    }
}
