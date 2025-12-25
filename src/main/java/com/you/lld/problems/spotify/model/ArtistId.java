package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class ArtistId {
    private final String value;
    public ArtistId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("ArtistId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtistId that = (ArtistId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "ArtistId{" + value + '}'; }
}
