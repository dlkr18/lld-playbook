# Bloom Filter Implementation

## Problem: Bloom Filter

A space-efficient probabilistic data structure used to test whether an element is a member of a set.

**Difficulty**: Easy  
**Pattern**: Bit Array + Hash Functions  
**Time to Complete**: 30-45 minutes

---

## Implementation

### Core Class

```java
package com.you.lld.problems.bloomfilter;

import java.util.BitSet;

public class BloomFilter<T> {
    private final BitSet bitSet;
    private final int size;
    private final int numberOfHashFunctions;
    private int elementCount;
    
    public BloomFilter(int expectedElements, double falsePositiveRate) {
        this.size = optimalSize(expectedElements, falsePositiveRate);
        this.numberOfHashFunctions = optimalHashFunctions(expectedElements, size);
        this.bitSet = new BitSet(size);
        this.elementCount = 0;
    }
    
    public void add(T element) {
        int[] hashes = getHashes(element);
        for (int hash : hashes) {
            bitSet.set(Math.abs(hash % size));
        }
        elementCount++;
    }
    
    public boolean mightContain(T element) {
        int[] hashes = getHashes(element);
        for (int hash : hashes) {
            if (!bitSet.get(Math.abs(hash % size))) {
                return false;
            }
        }
        return true;
    }
}
```

**Status**: ✅ **COMPLETE** - Full implementation available at `src/main/java/com/you/lld/problems/bloomfilter/BloomFilter.java`

---

## Key Features

- False positives possible, false negatives impossible
- Space-efficient compared to HashSet
- O(k) operations where k = number of hash functions
- Configurable false positive rate

---

## Use Cases

- Web crawlers (avoid re-crawling URLs)
- Database query optimization
- Spam filtering
- Cache filtering
- Duplicate detection

---

## Design Patterns

- **Factory Method**: For creating optimal bloom filters
- **Strategy Pattern**: Different hash function strategies

---

## Interview Tips

1. Explain trade-offs: space vs accuracy
2. Discuss optimal parameter calculation
3. Know when NOT to use (when false positives are unacceptable)
4. Mention real-world applications (Google BigTable, Chrome)

---

[← Back to Problems](../ALL_PROBLEMS_MASTER_GUIDE)

