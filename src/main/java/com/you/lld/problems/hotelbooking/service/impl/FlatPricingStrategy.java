package com.you.lld.problems.hotelbooking.service.impl;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.service.PricingStrategy;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Simplest pricing: {@code baseRate * nights}. Ignores season and occupancy.
 * Useful as a baseline and for tests where the expected total must be obvious.
 */
public final class FlatPricingStrategy implements PricingStrategy {

    @Override
    public BigDecimal totalFor(Room room, DateRange stay, double occupancyRatio) {
        return room.type().baseRate()
                .multiply(BigDecimal.valueOf(stay.nights()))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
