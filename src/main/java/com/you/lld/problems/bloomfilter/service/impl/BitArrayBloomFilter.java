package com.you.lld.problems.bloomfilter.service.impl;

import com.you.lld.problems.bloomfilter.model.BloomFilterConfig;
import com.you.lld.problems.bloomfilter.service.HashStrategy;
import java.util.BitSet;

/**
 * Classic bloom filter: a bit array plus k independent hash positions.
 *
 * <p>The k positions come from <b>seeding one hash function k different ways</b>,
 * not from double hashing ({@code h1 + i*h2}) — the previous doc claimed the
 * latter. Both are standard; this is the simpler one and it keeps
 * {@link HashStrategy} a single-method interface.
 *
 * <p><b>No remove():</b> a bit set by one element is very likely shared with
 * others, so clearing it would introduce false <em>negatives</em> — and "never a
 * false negative" is the filter's only hard guarantee. Deletion needs a counting
 * bloom filter (a small counter per slot instead of a bit).
 *
 * <p><b>Thread-safety:</b> {@link BitSet} is not thread-safe and {@code
 * elementCount} is a plain int, so every method that touches either is
 * {@code synchronized} — reads included. An unsynchronized reader is not merely
 * stale, it can observe a torn BitSet mid-update.
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

    public synchronized int getElementCount() {
        return elementCount;
    }

    public int getBitArraySize() {
        return bitArraySize;
    }

    public int getHashFunctionCount() {
        return hashFunctionCount;
    }

    /**
     * Estimated from the <em>observed</em> fill ratio: {@code (bitsSet/m)^k}.
     *
     * <p>Deliberately not the a-priori {@code (1 - e^(-kn/m))^k}. The empirical
     * form reflects what this filter actually holds — duplicate inserts set no new
     * bits, so a filter fed the same key a million times stays near-empty and this
     * reports that honestly, where the formula would predict saturation.
     */
    public synchronized double estimatedFalsePositiveRate() {
        double fillRatio = (double) bits.cardinality() / bitArraySize;
        return Math.pow(fillRatio, hashFunctionCount);
    }
}
