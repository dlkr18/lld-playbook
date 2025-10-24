package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for User entity.
 * Immutable value object that prevents mixing IDs of different entity types.
 */
public final class UserId {
    private final long value;
    
    public UserId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("UserId must be positive");
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
        UserId userId = (UserId) o;
        return value == userId.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "UserId{" + value + '}';
    }
}

