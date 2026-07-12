package com.you.lld.problems.airlinebooking.model;

import java.util.Objects;

/**
 * Immutable value object identifying an airport by its IATA code.
 *
 * <p>Equality is defined purely on the (uppercased) IATA code so airports can be
 * used as map keys and compared cheaply during flight search.
 */
public final class Airport {

    private final String code;
    private final String name;
    private final String city;

    public Airport(String code, String name, String city) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Airport code is required");
        }
        this.code = code.trim().toUpperCase();
        this.name = name == null ? this.code : name.trim();
        this.city = city == null ? "" : city.trim();
    }

    public String code() {
        return code;
    }

    public String name() {
        return name;
    }

    public String city() {
        return city;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Airport airport = (Airport) o;
        return code.equals(airport.code);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(code);
    }

    @Override
    public String toString() {
        return code;
    }
}
