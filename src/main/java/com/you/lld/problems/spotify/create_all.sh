#!/bin/bash
# Script to create all Spotify model files efficiently
cd "$(dirname "$0")/model"

# Create ID classes
for id in AlbumId ArtistId PlaylistId UserId; do
cat > "${id}.java" <<IDEOF
package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class ${id} {
    private final String value;
    public ${id}(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("${id} cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ${id} that = (${id}) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "${id}{" + value + '}'; }
}
IDEOF
done

echo "Created ID classes"
