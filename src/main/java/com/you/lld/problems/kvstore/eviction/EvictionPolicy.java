package com.you.lld.problems.kvstore.eviction;

public interface EvictionPolicy {
    String evict();
    void recordAccess(String key);
}
