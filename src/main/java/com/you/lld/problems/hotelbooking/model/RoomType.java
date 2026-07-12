package com.you.lld.problems.hotelbooking.model;

import java.math.BigDecimal;

/**
 * Category of room. Carries the sleeping {@code capacity} and the {@code baseRate}
 * (per-night list price before any pricing strategy is applied).
 *
 * <p>Modelled as an enum because the set of room categories is small, fixed, and
 * shared across all hotels; per-hotel rate overrides would live on {@link Room}.
 */
public enum RoomType {

    SINGLE(1, "80.00"),
    DOUBLE(2, "120.00"),
    DELUXE(2, "200.00"),
    SUITE(4, "350.00");

    private final int capacity;
    private final BigDecimal baseRate;

    RoomType(int capacity, String baseRate) {
        this.capacity = capacity;
        this.baseRate = new BigDecimal(baseRate);
    }

    public int capacity() {
        return capacity;
    }

    public BigDecimal baseRate() {
        return baseRate;
    }
}
