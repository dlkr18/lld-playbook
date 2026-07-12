package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.service.LateFeePolicy;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.Map;

/**
 * Charges {@code dailyRate(type) * penaltyMultiplier} for every started day the
 * car is late. Any part of a day counts as a whole late day (a customer 1 hour
 * late still pays for one late day), which is the common real-world rule.
 * Immutable / thread-safe.
 */
public final class StandardLateFeePolicy implements LateFeePolicy {

    private static final long MINUTES_PER_DAY = 24L * 60L;

    private final Map<CarType, BigDecimal> dailyRates;
    private final BigDecimal penaltyMultiplier;

    public StandardLateFeePolicy(Map<CarType, BigDecimal> dailyRates, BigDecimal penaltyMultiplier) {
        if (dailyRates == null) {
            throw new IllegalArgumentException("dailyRates required");
        }
        if (penaltyMultiplier == null || penaltyMultiplier.signum() < 0) {
            throw new IllegalArgumentException("penaltyMultiplier must be non-negative");
        }
        this.dailyRates = new EnumMap<CarType, BigDecimal>(dailyRates);
        for (CarType type : CarType.values()) {
            if (!this.dailyRates.containsKey(type)) {
                throw new IllegalArgumentException("Missing daily rate for " + type);
            }
        }
        this.penaltyMultiplier = penaltyMultiplier;
    }

    @Override
    public BigDecimal lateFee(CarType type, LocalDateTime scheduledDropoff, LocalDateTime actualReturn) {
        if (scheduledDropoff == null || actualReturn == null) {
            throw new IllegalArgumentException("timestamps required");
        }
        long minutesLate = Duration.between(scheduledDropoff, actualReturn).toMinutes();
        if (minutesLate <= 0) {
            return BigDecimal.ZERO;
        }
        long lateDays = (minutesLate + MINUTES_PER_DAY - 1) / MINUTES_PER_DAY; // ceil
        return dailyRates.get(type)
                .multiply(penaltyMultiplier)
                .multiply(BigDecimal.valueOf(lateDays));
    }
}
