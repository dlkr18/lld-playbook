package com.you.lld.problems.bloomfilter.hash;

public interface HashFunction {
    int hash(Object element, int seed);
}
