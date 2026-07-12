package com.you.lld.problems.bloomfilter.service.impl;

import com.you.lld.problems.bloomfilter.service.HashStrategy;

public final class MurmurHashStrategy implements HashStrategy {

    @Override
    public int hash(String element, int seed, int bitArraySize) {
        int hash = seed;
        for (int i = 0; i < element.length(); i++) {
            hash = 31 * hash + element.charAt(i);
            hash ^= (hash >>> 16);
        }
        return positiveMod(hash, bitArraySize);
    }

    static int positiveMod(int hash, int size) {
        int mod = hash % size;
        if (mod < 0) {
            mod += size;
        }
        return mod;
    }
}
