package com.you.lld.problems.bloomfilter.model;

/**
 * Optimal bit-array sizing from expected elements and false-positive rate.
 */
public final class BloomFilterConfig {

    private final int expectedElements;
    private final double falsePositiveRate;
    private final int bitArraySize;
    private final int hashFunctionCount;

    public BloomFilterConfig(int expectedElements, double falsePositiveRate) {
        if (expectedElements <= 0) {
            throw new IllegalArgumentException("expectedElements must be positive");
        }
        if (falsePositiveRate <= 0.0 || falsePositiveRate >= 1.0) {
            throw new IllegalArgumentException("falsePositiveRate must be in (0, 1)");
        }
        this.expectedElements = expectedElements;
        this.falsePositiveRate = falsePositiveRate;
        this.bitArraySize = optimalBitArraySize(expectedElements, falsePositiveRate);
        this.hashFunctionCount = optimalHashFunctionCount(bitArraySize, expectedElements);
    }

    public int getExpectedElements() {
        return expectedElements;
    }

    public double getFalsePositiveRate() {
        return falsePositiveRate;
    }

    public int getBitArraySize() {
        return bitArraySize;
    }

    public int getHashFunctionCount() {
        return hashFunctionCount;
    }

    private static int optimalBitArraySize(int n, double p) {
        double m = (-n * Math.log(p)) / (Math.log(2) * Math.log(2));
        return Math.max(1, (int) Math.ceil(m));
    }

    private static int optimalHashFunctionCount(int m, int n) {
        double k = ((double) m / n) * Math.log(2);
        return Math.max(1, (int) Math.round(k));
    }
}
