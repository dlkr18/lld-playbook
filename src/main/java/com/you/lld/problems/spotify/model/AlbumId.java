package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class AlbumId {
    private final String value;
    public AlbumId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("AlbumId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlbumId that = (AlbumId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "AlbumId{" + value + '}'; }
}
