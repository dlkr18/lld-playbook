package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

/**
 * Strategy for calculating ride fare.
 * Implementations can apply different pricing models (base, surge, time-of-day, etc.).
 */
public interface PricingStrategy {
    double calculateFare(double distanceKm, VehicleType vehicleType);
}
