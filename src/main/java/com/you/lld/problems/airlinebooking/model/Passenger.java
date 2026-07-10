package com.you.lld.problems.airlinebooking.model;

import java.util.Objects;

/**
 * Immutable passenger / traveller identity. Equality is on the passenger id.
 */
public final class Passenger {

    private final String id;
    private final String name;
    private final String email;

    public Passenger(String id, String name, String email) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Passenger id is required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Passenger name is required");
        }
        this.id = id.trim();
        this.name = name.trim();
        this.email = email == null ? "" : email.trim();
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
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Passenger that = (Passenger) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return name + " <" + email + ">";
    }
}
