package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for Question entity.
 */
public final class QuestionId {
    private final long value;
    
    public QuestionId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("QuestionId must be positive");
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
        QuestionId that = (QuestionId) o;
        return value == that.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "QuestionId{" + value + '}';
    }
}

