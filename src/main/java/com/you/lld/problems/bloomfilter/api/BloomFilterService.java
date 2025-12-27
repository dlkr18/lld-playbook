package com.you.lld.problems.bloomfilter.api;

public interface BloomFilterService<T> {
    void add(T element);
    boolean mightContain(T element);
    double getFalsePositiveProbability();
    void clear();
}
