package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.DateRange;
import com.you.lld.problems.carrental.service.PricingStrategy;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;

/**
 * Flat daily tariff: {@code base = dailyRate(type) * days}. The rate table is
 * injected (not baked into {@link CarType}) so pricing stays a pure service
 * concern. Immutable and therefore thread-safe.
 */
public final class DailyPricingStrategy implements PricingStrategy {

    private final Map<CarType, BigDecimal> dailyRates;

    public DailyPricingStrategy(Map<CarType, BigDecimal> dailyRates) {
        if (dailyRates == null) {
            throw new IllegalArgumentException("dailyRates required");
        }
        // defensive copy — callers cannot mutate our table after construction
        this.dailyRates = new EnumMap<CarType, BigDecimal>(dailyRates);
        for (CarType type : CarType.values()) {
            if (!this.dailyRates.containsKey(type)) {
                throw new IllegalArgumentException("Missing daily rate for " + type);
            }
        }
    }

    @Override
    public BigDecimal price(CarType type, DateRange period) {
        return dailyRates.get(type).multiply(BigDecimal.valueOf(period.days()));
    }
}
