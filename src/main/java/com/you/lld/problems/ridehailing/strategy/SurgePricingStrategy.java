package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

/**
 * Decorator that applies a surge multiplier on top of any base pricing strategy.
 * Used during high-demand periods (peak hours, rain, events).
 */
public class SurgePricingStrategy implements PricingStrategy {

    private final PricingStrategy delegate;
    private final double surgeMultiplier;

    public SurgePricingStrategy(PricingStrategy delegate, double surgeMultiplier) {
        if (surgeMultiplier < 1.0) {
            throw new IllegalArgumentException("Surge multiplier must be >= 1.0");
        }
        this.delegate = delegate;
        this.surgeMultiplier = surgeMultiplier;
    }

    @Override
    public double calculateFare(double distanceKm, VehicleType vehicleType) {
        double baseFare = delegate.calculateFare(distanceKm, vehicleType);
        return Math.round(baseFare * surgeMultiplier * 100.0) / 100.0;
    }

    public double getSurgeMultiplier() { return surgeMultiplier; }
}
