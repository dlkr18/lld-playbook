package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PricingStrategy;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Currency;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Per-hour pricing with per-vehicle-type rates, a grace period, and a floor.
 *
 * Rules:
 *   - Duration <= gracePeriod              -> FREE
 *   - Otherwise: round UP to full hours
 *                fee = hourlyRate * hours
 *                fee = max(fee, minimumCharge)
 *
 * Rounding up reflects how real lots bill ("1h 5m = 2 hours"); switch to
 * a different rounding rule if the business prefers.
 */
public class HourlyPricingStrategy implements PricingStrategy {

    private final Map<VehicleType, Money> hourlyRates;
    private final Money minimumCharge;
    private final Duration gracePeriod;
    private final Currency currency;

    public HourlyPricingStrategy() {
        this(Currency.getInstance("USD"));
    }

    public HourlyPricingStrategy(Currency currency) {
        this.currency = Objects.requireNonNull(currency, "currency");
        this.hourlyRates = new HashMap<>();
        this.hourlyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("10.00"), currency));
        this.hourlyRates.put(VehicleType.CAR,        Money.of(new BigDecimal("20.00"), currency));
        this.hourlyRates.put(VehicleType.TRUCK,      Money.of(new BigDecimal("40.00"), currency));
        this.hourlyRates.put(VehicleType.BUS,        Money.of(new BigDecimal("50.00"), currency));
        this.minimumCharge = Money.of(new BigDecimal("5.00"), currency);
        this.gracePeriod   = Duration.ofMinutes(15);
    }

    public HourlyPricingStrategy(Map<VehicleType, Money> hourlyRates,
                                 Money minimumCharge,
                                 Duration gracePeriod,
                                 Currency currency) {
        this.currency      = Objects.requireNonNull(currency, "currency");
        this.hourlyRates   = new HashMap<>(Objects.requireNonNull(hourlyRates, "hourlyRates"));
        this.minimumCharge = Objects.requireNonNull(minimumCharge, "minimumCharge");
        this.gracePeriod   = Objects.requireNonNull(gracePeriod, "gracePeriod");

        for (VehicleType type : VehicleType.values()) {
            if (!this.hourlyRates.containsKey(type)) {
                throw new IllegalArgumentException("missing hourly rate for " + type);
            }
        }
    }

    @Override
    public Money calculateFee(ParkingTicket ticket) {
        Objects.requireNonNull(ticket, "ticket");
        Duration d = ticket.duration();

        if (d.compareTo(gracePeriod) <= 0) {
            return Money.ofMinor(0, currency);
        }

        VehicleType type = ticket.getVehicle().getVehicleType();
        Money rate = hourlyRates.get(type);
        if (rate == null) {
            throw new IllegalStateException("no hourly rate configured for " + type);
        }

        long minutes = d.toMinutes();
        long hours = (minutes + 59) / 60;
        Money total = rate.times(hours);

        return total.compareTo(minimumCharge) < 0 ? minimumCharge : total;
    }

    @Override
    public String getDescription() {
        return "Hourly pricing (grace=" + gracePeriod.toMinutes() + "m, min=" + minimumCharge + ")";
    }

    public Money getHourlyRate(VehicleType type) { return hourlyRates.get(type); }
    public Money getMinimumCharge()              { return minimumCharge; }
    public Duration getGracePeriod()             { return gracePeriod; }
}
