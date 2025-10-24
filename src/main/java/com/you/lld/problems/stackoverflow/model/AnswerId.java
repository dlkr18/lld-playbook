package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for Answer entity.
 */
public final class AnswerId {
    private final long value;
    
    public AnswerId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("AnswerId must be positive");
        }
        this.value = value;
    }
    
    public long getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnswerId answerId = (AnswerId) o;
        return value == answerId.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "AnswerId{" + value + '}';
    }
}

