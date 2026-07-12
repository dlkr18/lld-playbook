package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PricingStrategy;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Day-pass pricing: one flat fee per calendar day, per vehicle type.
 *
 * Duration of 0..24h = 1 day; 24..48h = 2 days; etc.
 * Good example of an alternative Strategy with completely different math
 * from HourlyPricingStrategy while satisfying the same interface.
 */
public class FlatRatePricingStrategy implements PricingStrategy {

    private final Map<VehicleType, Money> dailyRates;

    public FlatRatePricingStrategy(Map<VehicleType, Money> dailyRates) {
        Objects.requireNonNull(dailyRates, "dailyRates");
        for (VehicleType t : VehicleType.values()) {
            if (!dailyRates.containsKey(t)) {
                throw new IllegalArgumentException("missing daily rate for " + t);
            }
        }
        this.dailyRates = new HashMap<>(dailyRates);
    }

    @Override
    public Money calculateFee(ParkingTicket ticket) {
        Objects.requireNonNull(ticket, "ticket");
        long hours = ticket.duration().toHours();
        long days = Math.max(1, (hours + 23) / 24);
        Money rate = dailyRates.get(ticket.getVehicle().getVehicleType());
        return rate.times(days);
    }

    @Override
    public String getDescription() {
        return "Flat daily-rate pricing: one rate per 24h period per vehicle type.";
    }
}
