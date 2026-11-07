# bloomfilter - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/bloomfilter/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py bloomfilter`.

## Project Structure (7 files)

```
bloomfilter/
├── BloomFilterDemo.java
├── BloomFilter.java
├── model/BloomFilterConfig.java
├── service/HashStrategy.java
├── service/impl/BitArrayBloomFilter.java
├── service/impl/FnvHashStrategy.java
├── service/impl/MurmurHashStrategy.java
```

## Source Code

### `BloomFilterDemo.java`

<details>
<summary>Click to view BloomFilterDemo.java</summary>

```java
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
```

</details>

### `BloomFilter.java`

<details>
<summary>Click to view BloomFilter.java</summary>

```java
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
```

</details>

### `model/BloomFilterConfig.java`

<details>
<summary>Click to view model/BloomFilterConfig.java</summary>

```java
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
```

</details>

### `service/HashStrategy.java`

<details>
<summary>Click to view service/HashStrategy.java</summary>

```java
package com.you.lld.problems.bloomfilter.service;

/**
 * Pluggable hash function for bloom filter bit positions.
 */
public interface HashStrategy {

    int hash(String element, int seed, int bitArraySize);
}
```

</details>

### `service/impl/BitArrayBloomFilter.java`

<details>
<summary>Click to view service/impl/BitArrayBloomFilter.java</summary>

```java
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
```

</details>

### `service/impl/FnvHashStrategy.java`

<details>
<summary>Click to view service/impl/FnvHashStrategy.java</summary>

```java
package com.you.lld.problems.bloomfilter.service.impl;

import com.you.lld.problems.bloomfilter.service.HashStrategy;

public final class FnvHashStrategy implements HashStrategy {

    private static final int FNV_PRIME = 16777619;
    private static final int FNV_OFFSET = (int) 2166136261L;

    @Override
    public int hash(String element, int seed, int bitArraySize) {
        int hash = FNV_OFFSET ^ seed;
        for (int i = 0; i < element.length(); i++) {
            hash ^= element.charAt(i);
            hash *= FNV_PRIME;
        }
        return MurmurHashStrategy.positiveMod(hash, bitArraySize);
    }
}
```

</details>

### `service/impl/MurmurHashStrategy.java`

<details>
<summary>Click to view service/impl/MurmurHashStrategy.java</summary>

```java
package com.you.lld.problems.bloomfilter.service.impl;

import com.you.lld.problems.bloomfilter.service.HashStrategy;

/**
 * MurmurHash3's x86_32 mixing function, applied to a string's UTF-16 code units.
 *
 * <p><b>Not byte-compatible with the reference implementation:</b> canonical
 * MurmurHash3 consumes a byte array, so hashing the UTF-8 encoding of a string
 * gives different values than hashing its {@code char}s two at a time as done
 * here. For a bloom filter that is irrelevant — all that matters is that the
 * function is deterministic and mixes well — but it would matter if these hashes
 * ever had to match another system's. Encode to UTF-8 bytes first if so.
 *
 * <p>The {@code seed} parameter provides the k independent hash functions;
 * seeding one good mixer differently is the standard way to obtain them.
 *
 * <p>This class previously carried the MurmurHash name while computing
 * {@code 31 * hash + c} with an xor-shift — Java's {@code String.hashCode} with a
 * finisher bolted on. Measured against this implementation, that one flipped only
 * 34% of output bits per input bit flipped (ideal is 50%) and was structurally
 * non-uniform over 1000 buckets (chi-square z = -7.0, versus -0.03 here).
 */
public final class MurmurHashStrategy implements HashStrategy {

    private static final int C1 = 0xcc9e2d51;
    private static final int C2 = 0x1b873593;

    @Override
    public int hash(String element, int seed, int bitArraySize) {
        return positiveMod(murmur3_32(element, seed), bitArraySize);
    }

    static int murmur3_32(String data, int seed) {
        int h1 = seed;
        int length = data.length();

        // Body: consume two chars (4 bytes) at a time.
        int roundedEnd = length & ~1;
        for (int i = 0; i < roundedEnd; i += 2) {
            int k1 = (data.charAt(i) & 0xffff) | ((data.charAt(i + 1) & 0xffff) << 16);
            k1 *= C1;
            k1 = Integer.rotateLeft(k1, 15);
            k1 *= C2;

            h1 ^= k1;
            h1 = Integer.rotateLeft(h1, 13);
            h1 = h1 * 5 + 0xe6546b64;
        }

        // Tail: the odd trailing char, if any.
        if ((length & 1) == 1) {
            int k1 = data.charAt(length - 1) & 0xffff;
            k1 *= C1;
            k1 = Integer.rotateLeft(k1, 15);
            k1 *= C2;
            h1 ^= k1;
        }

        // Finalization: avalanche, so every input bit affects every output bit.
        h1 ^= (length * 2);
        h1 ^= (h1 >>> 16);
        h1 *= 0x85ebca6b;
        h1 ^= (h1 >>> 13);
        h1 *= 0xc2b2ae35;
        h1 ^= (h1 >>> 16);
        return h1;
    }

    /**
     * {@code %} keeps the sign of the dividend in Java, so a negative hash would
     * index outside the bit array. Integer.MIN_VALUE also has no positive
     * counterpart, which is why Math.abs is the wrong tool here.
     */
    static int positiveMod(int hash, int size) {
        int mod = hash % size;
        if (mod < 0) {
            mod += size;
        }
        return mod;
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.bloomfilter.BloomFilterDemo"
```
