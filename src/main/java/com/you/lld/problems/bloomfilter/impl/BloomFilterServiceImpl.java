package com.you.lld.problems.bloomfilter.impl;

import com.you.lld.problems.bloomfilter.api.BloomFilterService;
import com.you.lld.problems.bloomfilter.model.BloomFilter;

public class BloomFilterServiceImpl<T> implements BloomFilterService<T> {
    private BloomFilter<T> filter;
    
    public BloomFilterServiceImpl(int size, int hashFunctions) {
        this.filter = new BloomFilter<>(size, hashFunctions);
    }
    
    @Override
    public void add(T element) {
        filter.add(element);
    }
    
    @Override
    public boolean mightContain(T element) {
        return filter.mightContain(element);
    }
    
    @Override
    public double getFalsePositiveProbability() {
        return filter.getFalsePositiveProbability();
    }
    
    @Override
    public void clear() {
        this.filter = new BloomFilter<>(filter.getSize(), filter.getHashFunctionCount());
    }
}
