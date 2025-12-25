package com.you.lld.problems.spotify.model;

import java.util.Objects;

/**
 * Type-safe identifier for Song entity.
 */
public final class SongId {
    private final String value;
    
    public SongId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("SongId cannot be null or empty");
        }
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SongId songId = (SongId) o;
        return value.equals(songId.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "SongId{" + value + '}';
    }
}



