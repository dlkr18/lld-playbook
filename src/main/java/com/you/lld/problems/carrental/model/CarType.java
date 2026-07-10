package com.you.lld.problems.carrental.model;

/**
 * Category of a rentable car. Drives pricing (each type has its own daily rate,
 * looked up by the {@code PricingStrategy}) and lets customers filter inventory.
 *
 * <p>Deliberately carries NO rate: money belongs to the pricing layer, not the
 * domain model, so the same catalogue can be priced by several strategies.
 */
public enum CarType {
    ECONOMY("Economy"),
    SUV("SUV"),
    LUXURY("Luxury");

    private final String displayName;

    CarType(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }
}
