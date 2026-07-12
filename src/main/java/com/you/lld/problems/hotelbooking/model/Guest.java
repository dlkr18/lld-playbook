package com.you.lld.problems.hotelbooking.model;

/** Immutable guest / customer value object. */
public final class Guest {

    private final String id;
    private final String name;
    private final String email;

    public Guest(String id, String name, String email) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("guest id required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("guest name required");
        }
        this.id = id;
        this.name = name;
        this.email = email; // optional
    }

    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public String email() {
        return email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Guest) o).id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Guest{" + id + ", " + name + "}";
    }
}
