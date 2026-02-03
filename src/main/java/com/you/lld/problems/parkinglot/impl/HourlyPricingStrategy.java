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
 * Hourly pricing strategy with different rates per vehicle type.
 * Implements time-based pricing with minimum charge and hourly increments.
 */
public class HourlyPricingStrategy implements PricingStrategy {
  
  private final Map<VehicleType, Money> hourlyRates;
  private final Money minimumCharge;
  private final Duration gracePeriod;
  private final Currency currency;
  
  /**
   * Creates a pricing strategy with default rates in USD.
   */
  public HourlyPricingStrategy() {
    this(Currency.getInstance("USD"));
  }
  
  /**
   * Creates a pricing strategy with default rates in specified currency.
   */
  public HourlyPricingStrategy(Currency currency) {
    this.currency = Objects.requireNonNull(currency, "Currency cannot be null");
    this.hourlyRates = new HashMap<>();
    this.hourlyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("10.00"), currency));
    this.hourlyRates.put(VehicleType.CAR, Money.of(new BigDecimal("20.00"), currency));
    this.hourlyRates.put(VehicleType.TRUCK, Money.of(new BigDecimal("40.00"), currency));
    this.hourlyRates.put(VehicleType.BUS, Money.of(new BigDecimal("50.00"), currency));
    this.minimumCharge = Money.of(new BigDecimal("5.00"), currency);
    this.gracePeriod = Duration.ofMinutes(15);
  }
  
  /**
   * Creates a pricing strategy with custom rates.
   */
  public HourlyPricingStrategy(Map<VehicleType, Money> hourlyRates, Money minimumCharge, Duration gracePeriod, Currency currency) {
    this.currency = Objects.requireNonNull(currency, "Currency cannot be null");
    this.hourlyRates = new HashMap<>(Objects.requireNonNull(hourlyRates, "Hourly rates cannot be null"));
    this.minimumCharge = Objects.requireNonNull(minimumCharge, "Minimum charge cannot be null");
    this.gracePeriod = Objects.requireNonNull(gracePeriod, "Grace period cannot be null");
    
    // Validate that all vehicle types have rates
    for (VehicleType type : VehicleType.values()) {
      if (!this.hourlyRates.containsKey(type)) {
        throw new IllegalArgumentException("Missing hourly rate for vehicle type: " + type);
      }
    }
  }
  
  @Override
  public Money calculateFee(ParkingTicket ticket) {
    Objects.requireNonNull(ticket, "Parking ticket cannot be null");
    
    Duration parkingDuration = ticket.calculateDuration();
    
    // Apply grace period - free if within grace period
    if (parkingDuration.compareTo(gracePeriod) <= 0) {
      return Money.ofMinor(0, currency);
    }
    
    VehicleType vehicleType = ticket.getVehicle().getVehicleType();
    Money hourlyRate = hourlyRates.get(vehicleType);
    
    if (hourlyRate == null) {
      throw new IllegalArgumentException("No hourly rate configured for vehicle type: " + vehicleType);
    }
    
    // Calculate hours (round up partial hours)
    long minutes = parkingDuration.toMinutes();
    long hours = (minutes + 59) / 60; // Round up to next hour
    
    // Calculate total fee
    Money totalFee = hourlyRate.times(hours);
    
    // Apply minimum charge
    if (totalFee.compareTo(minimumCharge) < 0) {
      return minimumCharge;
    }
    
    return totalFee;
  }
  
  @Override
  public String getDescription() {
    return "Hourly pricing strategy with grace period of " + gracePeriod.toMinutes() + " minutes";
  }
  
  /**
   * Gets the hourly rate for a specific vehicle type.
   */
  public Money getHourlyRate(VehicleType vehicleType) {
    return hourlyRates.get(vehicleType);
  }
  
  /**
   * Gets the minimum charge applied.
   */
  public Money getMinimumCharge() {
    return minimumCharge;
  }
  
  /**
   * Gets the grace period duration.
   */
  public Duration getGracePeriod() {
    return gracePeriod;
  }
}
