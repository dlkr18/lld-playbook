package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.SeatClass;
import com.you.lld.problems.airlinebooking.service.FarePricingStrategy;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Simplest pricing: a per-flight base fare scaled by the cabin class multiplier.
 * ECONOMY = base, BUSINESS = base x2.5, FIRST = base x4.
 */
public final class ClassBasedPricingStrategy implements FarePricingStrategy {

    private final BigDecimal baseFare;

    public ClassBasedPricingStrategy(BigDecimal baseFare) {
        if (baseFare == null || baseFare.signum() < 0) {
            throw new IllegalArgumentException("Base fare must be non-negative");
        }
        this.baseFare = baseFare;
    }

    @Override
    public BigDecimal price(Flight flight, SeatClass seatClass) {
        BigDecimal multiplier = BigDecimal.valueOf(seatClass.fareMultiplier());
        return baseFare.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
}
