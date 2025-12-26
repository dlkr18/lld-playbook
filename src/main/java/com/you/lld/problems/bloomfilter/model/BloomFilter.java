package com.you.lld.problems.bloomfilter.model;

import java.util.BitSet;

public class BloomFilter<T> {
    private final BitSet bitSet;
    private final int size;
    private final int hashFunctionCount;
    
    public BloomFilter(int size, int hashFunctionCount) {
        this.size = size;
        this.hashFunctionCount = hashFunctionCount;
        this.bitSet = new BitSet(size);
    }
    
    public void add(T element) {
        for (int i = 0; i < hashFunctionCount; i++) {
            int hash = getHash(element, i);
            bitSet.set(hash);
        }
    }
    
    public boolean mightContain(T element) {
        for (int i = 0; i < hashFunctionCount; i++) {
            int hash = getHash(element, i);
            if (!bitSet.get(hash)) {
                return false;
            }
        }
        return true;
    }
    
    private int getHash(T element, int seed) {
        int hash = element.hashCode();
        hash = hash ^ (hash >>> 16);
        hash = hash * 0x85ebca6b;
        hash = hash ^ (hash >>> 13);
        hash = hash * 0xc2b2ae35 * (seed + 1);
        hash = hash ^ (hash >>> 16);
        return Math.abs(hash % size);
    }
    
    public double getFalsePositiveProbability() {
        int bitsSet = bitSet.cardinality();
        double ratio = (double) bitsSet / size;
        return Math.pow(ratio, hashFunctionCount);
    }
    
    public int getSize() { return size; }
    public int getHashFunctionCount() { return hashFunctionCount; }
    public int getBitsSet() { return bitSet.cardinality(); }
}
