package com.you.lld.problems.bloomfilter;

public class BloomFilterDemo {

    public static void main(String[] args) {
        System.out.println("=== Bloom Filter Demo ===\n");
        demoOptimalSizing();
        demoNoFalseNegatives();
        demoFalsePositiveEstimate();
        demoHashStrategySwap();
        demoClearAndReuse();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoOptimalSizing() {
        System.out.println("--- 1. Optimal sizing from (n, p) ---");
        BloomFilter filter = BloomFilter.create(1000, 0.01);
        System.out.println("  bit array size=" + filter.getBitArraySize()
                + ", hash functions=" + filter.getHashFunctionCount());
        for (int i = 0; i < 1000; i++) {
            filter.add("user-" + i);
        }
        System.out.println("  inserted 1000 elements, estimated FPP="
                + String.format("%.4f", filter.estimatedFalsePositiveRate()));
    }

    private static void demoNoFalseNegatives() {
        System.out.println("\n--- 2. No false negatives ---");
        BloomFilter filter = BloomFilter.create(100, 0.05);
        filter.add("alice@email.com");
        filter.add("bob@email.com");
        System.out.println("  alice present: " + filter.mightContain("alice@email.com"));
        System.out.println("  carol absent (definite): " + filter.mightContain("carol@email.com"));
    }

    private static void demoFalsePositiveEstimate() {
        System.out.println("\n--- 3. False positive measurement ---");
        BloomFilter filter = BloomFilter.create(500, 0.02);
        for (int i = 0; i < 500; i++) {
            filter.add("member-" + i);
        }
        int falsePositives = 0;
        int probes = 1000;
        for (int i = 500; i < 500 + probes; i++) {
            if (filter.mightContain("member-" + i)) {
                falsePositives++;
            }
        }
        System.out.println("  probes on non-members=" + probes + ", false positives=" + falsePositives
                + ", measured rate=" + String.format("%.3f", (double) falsePositives / probes));
    }

    private static void demoHashStrategySwap() {
        System.out.println("\n--- 4. Hash strategy swap (Murmur vs FNV) ---");
        BloomFilter murmur = BloomFilter.create(50, 0.1, BloomFilter.murmur());
        BloomFilter fnv = BloomFilter.create(50, 0.1, BloomFilter.fnv());
        murmur.add("order-42");
        fnv.add("order-42");
        System.out.println("  Murmur mightContain: " + murmur.mightContain("order-42")
                + " (bits=" + murmur.getBitArraySize() + ")");
        System.out.println("  FNV mightContain: " + fnv.mightContain("order-42")
                + " (bits=" + fnv.getBitArraySize() + ")");
    }

    private static void demoClearAndReuse() {
        System.out.println("\n--- 5. Clear and reuse bit array ---");
        BloomFilter filter = BloomFilter.create(20, 0.1);
        filter.add("temp-token");
        System.out.println("  before clear: " + filter.mightContain("temp-token")
                + ", count=" + filter.getElementCount());
        filter.clear();
        System.out.println("  after clear: " + filter.mightContain("temp-token")
                + ", count=" + filter.getElementCount());
    }
}
