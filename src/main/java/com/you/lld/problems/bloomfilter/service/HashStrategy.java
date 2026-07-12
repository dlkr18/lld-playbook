package com.you.lld.problems.bloomfilter.service;

/**
 * Pluggable hash function for bloom filter bit positions.
 */
public interface HashStrategy {

    int hash(String element, int seed, int bitArraySize);
}
