package com.you.lld.problems.hotelbooking.service.impl;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.service.PricingStrategy;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Dynamic, demand-based pricing: the busier the hotel is for a given room type
 * on the requested dates, the higher the rate. Total is
 * {@code baseRate * nights * (1 + maxSurge * occupancyRatio)}.
 *
 * <p>Example with {@code maxSurge = 0.8}: at 0% occupancy the guest pays the base
 * rate; at 100% occupancy they pay 1.8x. This is the strategy that actually
 * consumes the {@code occupancyRatio} argument the other two ignore.
 */
public final class OccupancyPricingStrategy implements PricingStrategy {

    private final BigDecimal maxSurge;

    public OccupancyPricingStrategy() {
        this(new BigDecimal("0.8"));
    }

    public OccupancyPricingStrategy(BigDecimal maxSurge) {
        if (maxSurge == null || maxSurge.signum() < 0) {
            throw new IllegalArgumentException("maxSurge must be non-negative");
        }
        this.maxSurge = maxSurge;
    }

    @Override
    public BigDecimal totalFor(Room room, DateRange stay, double occupancyRatio) {
        double clamped = Math.max(0.0, Math.min(1.0, occupancyRatio));
        BigDecimal multiplier = BigDecimal.ONE.add(maxSurge.multiply(BigDecimal.valueOf(clamped)));
        return room.type().baseRate()
                .multiply(BigDecimal.valueOf(stay.nights()))
                .multiply(multiplier)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
