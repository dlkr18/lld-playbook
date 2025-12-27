# bloomfilter - Complete Implementation

## 📁 Project Structure (10 files)

```
bloomfilter/
├── BloomFilter.java
├── BloomFilterDemo.java
├── api/BloomFilterService.java
├── config/BloomFilterConfig.java
├── hash/HashFunction.java
├── hash/MurmurHashFunction.java
├── impl/BloomFilterServiceImpl.java
├── model/BloomFilter.java
├── model/ScalableBloomFilter.java
├── util/BloomFilterStats.java
```

## 📝 Source Code

### 📄 `BloomFilter.java`

```java
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

```

### 📄 `BloomFilterDemo.java`

```java
package com.you.lld.problems.bloomfilter;

import com.you.lld.problems.bloomfilter.model.BloomFilter;

public class BloomFilterDemo {
    public static void main(String[] args) {
        System.out.println("🌸 Bloom Filter Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();
        
        BloomFilter<String> filter = new BloomFilter<>(1000, 3);
        
        System.out.println("Adding emails:");
        String[] emails = {"alice@example.com", "bob@example.com", "charlie@example.com"};
        for (String email : emails) {
            filter.add(email);
            System.out.println("  ✓ " + email);
        }
        
        System.out.println("\nTesting membership:");
        for (String email : emails) {
            System.out.println("  " + email + ": " + filter.mightContain(email));
        }
        
        System.out.println("  david@example.com: " + filter.mightContain("david@example.com"));
        
        System.out.println("\nStatistics:");
        System.out.println("  Bits set: " + filter.getBitsSet());
        System.out.printf("  False positive: %.4f%%\n", filter.getFalsePositiveProbability() * 100);
        
        System.out.println("\n✅ Demo complete!");
    }
}
```

### 📄 `api/BloomFilterService.java`

```java
package com.you.lld.problems.bloomfilter.api;

public interface BloomFilterService<T> {
    void add(T element);
    boolean mightContain(T element);
    double getFalsePositiveProbability();
    void clear();
}
```

### 📄 `config/BloomFilterConfig.java`

```java
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
```

### 📄 `hash/HashFunction.java`

```java
package com.you.lld.problems.bloomfilter.hash;

public interface HashFunction {
    int hash(Object element, int seed);
}
```

### 📄 `hash/MurmurHashFunction.java`

```java
package com.you.lld.problems.bloomfilter.hash;

public class MurmurHashFunction implements HashFunction {
    @Override
    public int hash(Object element, int seed) {
        int hash = element.hashCode();
        hash = hash ^ (hash >>> 16);
        hash = hash * 0x85ebca6b;
        hash = hash ^ (hash >>> 13);
        hash = hash * 0xc2b2ae35 * (seed + 1);
        hash = hash ^ (hash >>> 16);
        return hash;
    }
}
```

### 📄 `impl/BloomFilterServiceImpl.java`

```java
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
```

### 📄 `model/BloomFilter.java`

```java
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
```

### 📄 `model/ScalableBloomFilter.java`

```java
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
```

### 📄 `util/BloomFilterStats.java`

```java
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
```

