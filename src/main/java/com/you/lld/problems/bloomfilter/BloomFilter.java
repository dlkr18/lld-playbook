package com.you.lld.problems.bloomfilter;

import com.you.lld.problems.bloomfilter.model.BloomFilterConfig;
import com.you.lld.problems.bloomfilter.service.HashStrategy;
import com.you.lld.problems.bloomfilter.service.impl.BitArrayBloomFilter;
import com.you.lld.problems.bloomfilter.service.impl.FnvHashStrategy;
import com.you.lld.problems.bloomfilter.service.impl.MurmurHashStrategy;

/**
 * Facade for creating and using bloom filters with configurable hash strategies.
 */
public final class BloomFilter {

    private final BitArrayBloomFilter delegate;

    private BloomFilter(BitArrayBloomFilter delegate) {
        this.delegate = delegate;
    }

    public static BloomFilter create(int expectedElements, double falsePositiveRate) {
        return create(expectedElements, falsePositiveRate, new MurmurHashStrategy());
    }

    public static BloomFilter create(int expectedElements, double falsePositiveRate, HashStrategy hashStrategy) {
        BloomFilterConfig config = new BloomFilterConfig(expectedElements, falsePositiveRate);
        return new BloomFilter(new BitArrayBloomFilter(config, hashStrategy));
    }

    public void add(String element) {
        delegate.add(element);
    }

    public boolean mightContain(String element) {
        return delegate.mightContain(element);
    }

    public void clear() {
        delegate.clear();
    }

    public int getElementCount() {
        return delegate.getElementCount();
    }

    public double estimatedFalsePositiveRate() {
        return delegate.estimatedFalsePositiveRate();
    }

    public int getBitArraySize() {
        return delegate.getBitArraySize();
    }

    public int getHashFunctionCount() {
        return delegate.getHashFunctionCount();
    }

    public static HashStrategy murmur() {
        return new MurmurHashStrategy();
    }

    public static HashStrategy fnv() {
        return new FnvHashStrategy();
    }
}
