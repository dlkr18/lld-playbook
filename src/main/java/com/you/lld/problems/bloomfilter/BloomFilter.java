package com.you.lld.problems.bloomfilter;

import java.util.BitSet;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

/**
 * Bloom Filter - A space-efficient probabilistic data structure
 * Used to test whether an element is a member of a set
 * 
 * Features:
 * - False positives possible, false negatives impossible
 * - O(k) add and contains operations where k = number of hash functions
 * - Space efficient compared to HashSet
 * 
 * Use Cases:
 * - Web crawlers (avoid re-crawling URLs)
 * - Database query optimization
 * - Spam filtering
 * - Cache filtering
 */
public class BloomFilter<T> {
    private final BitSet bitSet;
    private final int size;
    private final int numberOfHashFunctions;
    private int elementCount;
    
    /**
     * Constructor with optimal parameters
     * 
     * @param expectedElements Expected number of elements
     * @param falsePositiveRate Desired false positive rate (e.g., 0.01 for 1%)
     */
    public BloomFilter(int expectedElements, double falsePositiveRate) {
        this.size = optimalSize(expectedElements, falsePositiveRate);
        this.numberOfHashFunctions = optimalHashFunctions(expectedElements, size);
        this.bitSet = new BitSet(size);
        this.elementCount = 0;
    }
    
    /**
     * Constructor with explicit parameters
     */
    public BloomFilter(int size, int numberOfHashFunctions) {
        this.size = size;
        this.numberOfHashFunctions = numberOfHashFunctions;
        this.bitSet = new BitSet(size);
        this.elementCount = 0;
    }
    
    /**
     * Add an element to the bloom filter
     * 
     * @param element Element to add
     */
    public void add(T element) {
        int[] hashes = getHashes(element);
        for (int hash : hashes) {
            bitSet.set(Math.abs(hash % size));
        }
        elementCount++;
    }
    
    /**
     * Check if element might be in the set
     * 
     * @param element Element to check
     * @return true if element might be present (possible false positive)
     *         false if element is definitely not present
     */
    public boolean mightContain(T element) {
        int[] hashes = getHashes(element);
        for (int hash : hashes) {
            if (!bitSet.get(Math.abs(hash % size))) {
                return false; // Definitely not present
            }
        }
        return true; // Might be present
    }
    
    /**
     * Clear all elements from the filter
     */
    public void clear() {
        bitSet.clear();
        elementCount = 0;
    }
    
    /**
     * Get approximate element count
     */
    public int getApproximateElementCount() {
        return elementCount;
    }
    
    /**
     * Get current false positive probability
     */
    public double getCurrentFalsePositiveProbability() {
        int bitsSet = bitSet.cardinality();
        double ratio = (double) bitsSet / size;
        return Math.pow(ratio, numberOfHashFunctions);
    }
    
    /**
     * Get statistics about the bloom filter
     */
    public BloomFilterStats getStats() {
        int bitsSet = bitSet.cardinality();
        double fillRatio = (double) bitsSet / size;
        double currentFPP = getCurrentFalsePositiveProbability();
        
        return new BloomFilterStats(
            size,
            numberOfHashFunctions,
            elementCount,
            bitsSet,
            fillRatio,
            currentFPP
        );
    }
    
    /**
     * Generate k hash values for an element using double hashing
     */
    private int[] getHashes(T element) {
        int[] hashes = new int[numberOfHashFunctions];
        
        // Use two hash functions and combine them (double hashing)
        int hash1 = element.hashCode();
        int hash2 = murmurHash(element.toString());
        
        for (int i = 0; i < numberOfHashFunctions; i++) {
            hashes[i] = hash1 + i * hash2;
        }
        
        return hashes;
    }
    
    /**
     * Simple Murmur hash implementation
     */
    private int murmurHash(String data) {
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);
        int hash = 0;
        for (byte b : bytes) {
            hash = hash * 31 + b;
        }
        return hash;
    }
    
    /**
     * Calculate optimal bit array size
     * m = -(n * ln(p)) / (ln(2)^2)
     */
    private static int optimalSize(int n, double p) {
        return (int) Math.ceil(-(n * Math.log(p)) / Math.pow(Math.log(2), 2));
    }
    
    /**
     * Calculate optimal number of hash functions
     * k = (m/n) * ln(2)
     */
    private static int optimalHashFunctions(int n, int m) {
        int k = (int) Math.ceil((m / (double) n) * Math.log(2));
        return Math.max(1, k);
    }
    
    /**
     * Statistics class
     */
    public static class BloomFilterStats {
        public final int size;
        public final int numberOfHashFunctions;
        public final int elementCount;
        public final int bitsSet;
        public final double fillRatio;
        public final double falsePositiveProbability;
        
        public BloomFilterStats(int size, int numberOfHashFunctions, int elementCount,
                               int bitsSet, double fillRatio, double falsePositiveProbability) {
            this.size = size;
            this.numberOfHashFunctions = numberOfHashFunctions;
            this.elementCount = elementCount;
            this.bitsSet = bitsSet;
            this.fillRatio = fillRatio;
            this.falsePositiveProbability = falsePositiveProbability;
        }
        
        @Override
        public String toString() {
            return String.format(
                "BloomFilterStats{size=%d, hashFunctions=%d, elements=%d, " +
                "bitsSet=%d, fillRatio=%.2f%%, falsePositiveProb=%.4f%%}",
                size, numberOfHashFunctions, elementCount, bitsSet, 
                fillRatio * 100, falsePositiveProbability * 100
            );
        }
    }
    
    /**
     * Demo usage
     */
    public static void main(String[] args) {
        // Create bloom filter for 1000 elements with 1% false positive rate
        BloomFilter<String> urlFilter = new BloomFilter<>(1000, 0.01);
        
        System.out.println("=== Bloom Filter Demo ===\n");
        
        // Add URLs
        String[] visitedUrls = {
            "https://example.com",
            "https://google.com",
            "https://github.com",
            "https://stackoverflow.com",
            "https://reddit.com"
        };
        
        System.out.println("Adding URLs:");
        for (String url : visitedUrls) {
            urlFilter.add(url);
            System.out.println("  + " + url);
        }
        
        System.out.println("\nChecking URLs:");
        
        // Check existing URLs
        for (String url : visitedUrls) {
            System.out.println("  " + url + " -> " + 
                (urlFilter.mightContain(url) ? "MIGHT BE PRESENT ✓" : "NOT PRESENT"));
        }
        
        // Check non-existing URLs
        String[] newUrls = {
            "https://amazon.com",
            "https://netflix.com",
            "https://twitter.com"
        };
        
        System.out.println("\nChecking new URLs:");
        for (String url : newUrls) {
            System.out.println("  " + url + " -> " + 
                (urlFilter.mightContain(url) ? "MIGHT BE PRESENT (False Positive?)" : "NOT PRESENT ✓"));
        }
        
        // Print statistics
        System.out.println("\n" + urlFilter.getStats());
    }
}


