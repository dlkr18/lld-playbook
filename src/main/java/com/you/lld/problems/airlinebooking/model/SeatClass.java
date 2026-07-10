package com.you.lld.problems.airlinebooking.model;

/**
 * Cabin classes offered on a flight, ordered cheapest-first.
 *
 * <p>The {@code fareMultiplier} lets a base-fare pricing strategy derive a
 * per-class price without hard-coding numbers per class.
 */
public enum SeatClass {

    ECONOMY(1.0),
    BUSINESS(2.5),
    FIRST(4.0);

    private final double fareMultiplier;

    SeatClass(double fareMultiplier) {
        this.fareMultiplier = fareMultiplier;
    }

    public double fareMultiplier() {
        return fareMultiplier;
    }
}
