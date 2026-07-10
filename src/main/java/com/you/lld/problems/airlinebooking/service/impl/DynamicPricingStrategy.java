package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.SeatClass;
import com.you.lld.problems.airlinebooking.service.FarePricingStrategy;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Demand-based pricing: the class-scaled base fare is multiplied by a
 * time-to-departure surge factor. Seats bought closer to departure cost more,
 * modelling last-minute demand.
 *
 * <p>Kept dependency-free of {@code SeatInventory} on purpose: it derives surge
 * purely from the {@link Flight}'s departure time and a supplied reference
 * clock, so it honours the {@link FarePricingStrategy} contract unchanged. An
 * occupancy-based variant would inject an occupancy provider instead.
 */
public final class DynamicPricingStrategy implements FarePricingStrategy {

    private final BigDecimal baseFare;
    private final LocalDateTime now;

    public DynamicPricingStrategy(BigDecimal baseFare, LocalDateTime now) {
        if (baseFare == null || baseFare.signum() < 0) {
            throw new IllegalArgumentException("Base fare must be non-negative");
        }
        if (now == null) {
            throw new IllegalArgumentException("Reference time is required");
        }
        this.baseFare = baseFare;
        this.now = now;
    }

    @Override
    public BigDecimal price(Flight flight, SeatClass seatClass) {
        BigDecimal classPrice = baseFare.multiply(BigDecimal.valueOf(seatClass.fareMultiplier()));
        BigDecimal surge = surgeFactor(flight);
        return classPrice.multiply(surge).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal surgeFactor(Flight flight) {
        long daysToDeparture = Duration.between(now, flight.departure()).toDays();
        if (daysToDeparture <= 1) {
            return BigDecimal.valueOf(1.5);
        }
        if (daysToDeparture <= 7) {
            return BigDecimal.valueOf(1.2);
        }
        return BigDecimal.ONE;
    }
}
