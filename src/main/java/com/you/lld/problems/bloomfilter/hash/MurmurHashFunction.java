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
