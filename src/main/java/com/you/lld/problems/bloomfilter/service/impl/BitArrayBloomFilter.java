package com.you.lld.problems.bloomfilter.service.impl;

import com.you.lld.problems.bloomfilter.model.BloomFilterConfig;
import com.you.lld.problems.bloomfilter.service.HashStrategy;
import java.util.BitSet;

/**
 * Classic bloom filter: bit array + k independent hash positions via double hashing.
 */
public final class BitArrayBloomFilter {

    private final BitSet bits;
    private final int bitArraySize;
    private final int hashFunctionCount;
    private final HashStrategy hashStrategy;
    private int elementCount;

    public BitArrayBloomFilter(BloomFilterConfig config, HashStrategy hashStrategy) {
        this.bitArraySize = config.getBitArraySize();
        this.hashFunctionCount = config.getHashFunctionCount();
        this.hashStrategy = hashStrategy;
        this.bits = new BitSet(bitArraySize);
    }

    public synchronized void add(String element) {
        for (int i = 0; i < hashFunctionCount; i++) {
            int index = hashStrategy.hash(element, i, bitArraySize);
            bits.set(index);
        }
        elementCount++;
    }

    public synchronized boolean mightContain(String element) {
        for (int i = 0; i < hashFunctionCount; i++) {
            int index = hashStrategy.hash(element, i, bitArraySize);
            if (!bits.get(index)) {
                return false;
            }
        }
        return true;
    }

    public synchronized void clear() {
        bits.clear();
        elementCount = 0;
    }

    public int getElementCount() {
        return elementCount;
    }

    public int getBitArraySize() {
        return bitArraySize;
    }

    public int getHashFunctionCount() {
        return hashFunctionCount;
    }

    public double estimatedFalsePositiveRate() {
        double fillRatio = (double) bits.cardinality() / bitArraySize;
        return Math.pow(fillRatio, hashFunctionCount);
    }
}
