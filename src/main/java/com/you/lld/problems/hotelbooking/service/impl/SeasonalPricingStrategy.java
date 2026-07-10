package com.you.lld.problems.hotelbooking.service.impl;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.service.PricingStrategy;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;

/**
 * Seasonal pricing: each night is billed at {@code baseRate * seasonMultiplier},
 * where the multiplier depends on the calendar month of that night. This is why
 * the strategy prices <b>per-night</b> rather than once for the whole stay — a
 * stay can straddle a season boundary (e.g. Nov 30 -> Dec 1).
 *
 * <p>Peak (Jun-Aug, Dec): x1.5. Shoulder (Mar-May, Sep): x1.2. Off-peak: x1.0.
 */
public final class SeasonalPricingStrategy implements PricingStrategy {

    private static final BigDecimal PEAK = new BigDecimal("1.5");
    private static final BigDecimal SHOULDER = new BigDecimal("1.2");
    private static final BigDecimal OFF_PEAK = BigDecimal.ONE;

    @Override
    public BigDecimal totalFor(Room room, DateRange stay, double occupancyRatio) {
        BigDecimal base = room.type().baseRate();
        BigDecimal total = BigDecimal.ZERO;
        LocalDate day = stay.checkIn();
        while (day.isBefore(stay.checkOut())) {
            total = total.add(base.multiply(multiplierFor(day.getMonth())));
            day = day.plusDays(1);
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal multiplierFor(Month month) {
        switch (month) {
            case JUNE:
            case JULY:
            case AUGUST:
            case DECEMBER:
                return PEAK;
            case MARCH:
            case APRIL:
            case MAY:
            case SEPTEMBER:
                return SHOULDER;
            default:
                return OFF_PEAK;
        }
    }
}
