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
