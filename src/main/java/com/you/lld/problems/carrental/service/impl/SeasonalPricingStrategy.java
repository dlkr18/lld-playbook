package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.DateRange;
import com.you.lld.problems.carrental.service.PricingStrategy;

import java.math.BigDecimal;
import java.time.Month;
import java.util.EnumSet;
import java.util.Set;

/**
 * Seasonal surge pricing implemented as a Strategy that also <em>decorates</em>
 * another {@link PricingStrategy}: it delegates to the wrapped strategy for the
 * base amount, then multiplies by a peak surcharge when the pickup falls in a
 * peak month. Composing rather than subclassing means surge works on top of the
 * daily <em>or</em> weekly tariff without duplicating either. Immutable / thread-safe.
 */
public final class SeasonalPricingStrategy implements PricingStrategy {

    private final PricingStrategy base;
    private final Set<Month> peakMonths;
    private final BigDecimal peakMultiplier;

    public SeasonalPricingStrategy(PricingStrategy base, Set<Month> peakMonths, BigDecimal peakMultiplier) {
        if (base == null) {
            throw new IllegalArgumentException("base strategy required");
        }
        if (peakMonths == null || peakMonths.isEmpty()) {
            throw new IllegalArgumentException("at least one peak month required");
        }
        if (peakMultiplier == null || peakMultiplier.signum() <= 0) {
            throw new IllegalArgumentException("peakMultiplier must be positive");
        }
        this.base = base;
        this.peakMonths = EnumSet.copyOf(peakMonths);
        this.peakMultiplier = peakMultiplier;
    }

    @Override
    public BigDecimal price(CarType type, DateRange period) {
        BigDecimal amount = base.price(type, period);
        if (peakMonths.contains(period.getPickup().getMonth())) {
            amount = amount.multiply(peakMultiplier);
        }
        return amount;
    }
}
