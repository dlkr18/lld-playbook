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
