package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;

/**
 * Standard pricing: base fare + per-km rate, both varying by vehicle type.
 *
 *   BIKE:  base $3 + $2/km
 *   AUTO:  base $4 + $3/km
 *   SEDAN: base $5 + $3.50/km
 *   SUV:   base $7 + $5/km
 */
public class BasePricingStrategy implements PricingStrategy {

    private static final Map<VehicleType, double[]> RATES;

    static {
        Map<VehicleType, double[]> m = new EnumMap<>(VehicleType.class);
        m.put(VehicleType.BIKE,  new double[]{3.0, 2.0});
        m.put(VehicleType.AUTO,  new double[]{4.0, 3.0});
        m.put(VehicleType.SEDAN, new double[]{5.0, 3.5});
        m.put(VehicleType.SUV,   new double[]{7.0, 5.0});
        RATES = Collections.unmodifiableMap(m);
    }

    @Override
    public double calculateFare(double distanceKm, VehicleType vehicleType) {
        double[] rates = RATES.getOrDefault(vehicleType, new double[]{5.0, 3.0});
        return Math.round((rates[0] + distanceKm * rates[1]) * 100.0) / 100.0;
    }
}
