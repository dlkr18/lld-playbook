package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.CacheEventListener;

/** Prints cache events to stdout. Swap for a metrics listener in production. */
public final class LoggingCacheListener<K, V> implements CacheEventListener<K, V> {

    @Override public void onPut(K key, V value)    { log("PUT    " + key + " = " + value); }
    @Override public void onHit(K key, V value)    { log("HIT    " + key + " → " + value); }
    @Override public void onMiss(K key)            { log("MISS   " + key); }
    @Override public void onEvict(K key, V value)  { log("EVICT  " + key); }
    @Override public void onRemove(K key, V value) { log("REMOVE " + key); }
    @Override public void onClear()                { log("CLEAR"); }

    private void log(String msg) { System.out.println("  [cache] " + msg); }
}
