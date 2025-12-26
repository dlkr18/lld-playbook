package com.you.lld.problems.bloomfilter.config;

public class BloomFilterConfig {
    private final int size;
    private final int hashFunctionCount;
    private final double expectedFalsePositiveRate;
    
    public BloomFilterConfig(int expectedElements, double falsePositiveRate) {
        this.expectedFalsePositiveRate = falsePositiveRate;
        this.size = calculateOptimalSize(expectedElements, falsePositiveRate);
        this.hashFunctionCount = calculateOptimalHashFunctions(size, expectedElements);
    }
    
    private int calculateOptimalSize(int n, double p) {
        return (int) Math.ceil((-n * Math.log(p)) / Math.pow(Math.log(2), 2));
    }
    
    private int calculateOptimalHashFunctions(int m, int n) {
        return (int) Math.ceil((m / (double) n) * Math.log(2));
    }
    
    public int getSize() { return size; }
    public int getHashFunctionCount() { return hashFunctionCount; }
    public double getExpectedFalsePositiveRate() { return expectedFalsePositiveRate; }
}
