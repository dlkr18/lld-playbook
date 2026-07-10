package com.you.lld.problems.carrental.model;

import java.util.Objects;

/**
 * A pickup / drop-off branch. Immutable value object; equality is by id so two
 * handles to the same branch compare equal.
 */
public final class Location {
    private final String id;
    private final String name;

    public Location(String id, String name) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Location id required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Location name required");
        }
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return name;
    }
}
