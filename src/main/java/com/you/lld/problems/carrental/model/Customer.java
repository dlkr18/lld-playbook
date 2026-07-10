package com.you.lld.problems.carrental.model;

import java.util.Objects;

/**
 * A renter. Immutable value object; equality by id.
 */
public final class Customer {
    private final String id;
    private final String name;
    private final String email;

    public Customer(String id, String name, String email) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer id required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email required");
        }
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Customer) o).id);
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
