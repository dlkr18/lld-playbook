package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.DateRange;
import com.you.lld.problems.carrental.service.PricingStrategy;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;

/**
 * Weekly-discount tariff: every full 7-day block is billed at
 * {@code billedDaysPerWeek} days (default 6 — "rent a week, pay for six"), while
 * leftover days are billed at the flat daily rate. Rewards longer rentals.
 * Immutable / thread-safe.
 */
public final class WeeklyPricingStrategy implements PricingStrategy {

    private static final int DAYS_PER_WEEK = 7;

    private final Map<CarType, BigDecimal> dailyRates;
    private final int billedDaysPerWeek;

    public WeeklyPricingStrategy(Map<CarType, BigDecimal> dailyRates, int billedDaysPerWeek) {
        if (dailyRates == null) {
            throw new IllegalArgumentException("dailyRates required");
        }
        if (billedDaysPerWeek < 1 || billedDaysPerWeek > DAYS_PER_WEEK) {
            throw new IllegalArgumentException("billedDaysPerWeek must be in [1,7]");
        }
        this.dailyRates = new EnumMap<CarType, BigDecimal>(dailyRates);
        for (CarType type : CarType.values()) {
            if (!this.dailyRates.containsKey(type)) {
                throw new IllegalArgumentException("Missing daily rate for " + type);
            }
        }
        this.billedDaysPerWeek = billedDaysPerWeek;
    }

    @Override
    public BigDecimal price(CarType type, DateRange period) {
        long days = period.days();
        long fullWeeks = days / DAYS_PER_WEEK;
        long remainder = days % DAYS_PER_WEEK;
        long billedDays = fullWeeks * billedDaysPerWeek + remainder;
        return dailyRates.get(type).multiply(BigDecimal.valueOf(billedDays));
    }
}
