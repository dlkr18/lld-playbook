package com.you.lld.problems.bloomfilter.model;

import java.util.*;

public class ScalableBloomFilter<T> {
    private final List<BloomFilter<T>> filters;
    private final int initialSize;
    private final int hashFunctions;
    private final double errorRate;
    
    public ScalableBloomFilter(int initialSize, int hashFunctions, double errorRate) {
        this.initialSize = initialSize;
        this.hashFunctions = hashFunctions;
        this.errorRate = errorRate;
        this.filters = new ArrayList<>();
        addNewFilter();
    }
    
    private void addNewFilter() {
        int size = initialSize * (int) Math.pow(2, filters.size());
        filters.add(new BloomFilter<>(size, hashFunctions));
    }
    
    public void add(T element) {
        BloomFilter<T> currentFilter = filters.get(filters.size() - 1);
        
        if (currentFilter.getFalsePositiveProbability() > errorRate) {
            addNewFilter();
            currentFilter = filters.get(filters.size() - 1);
        }
        
        currentFilter.add(element);
    }
    
    public boolean mightContain(T element) {
        for (BloomFilter<T> filter : filters) {
            if (filter.mightContain(element)) {
                return true;
            }
        }
        return false;
    }
    
    public int getFilterCount() {
        return filters.size();
    }
}
