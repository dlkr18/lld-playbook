package com.you.lld.problems.bloomfilter.util;

public class BloomFilterStats {
    private int elementsAdded;
    private int falsePositives;
    private int trueNegatives;
    
    public void recordAdd() {
        elementsAdded++;
    }
    
    public void recordFalsePositive() {
        falsePositives++;
    }
    
    public void recordTrueNegative() {
        trueNegatives++;
    }
    
    public double getActualFalsePositiveRate() {
        int total = falsePositives + trueNegatives;
        return total == 0 ? 0.0 : (double) falsePositives / total;
    }
    
    public int getElementsAdded() { return elementsAdded; }
    public int getFalsePositives() { return falsePositives; }
}
