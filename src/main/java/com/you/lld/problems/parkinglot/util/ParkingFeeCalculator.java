package com.you.lld.problems.parkinglot.util;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Currency;

/**
 * Utility class for parking fee calculations.
 */
public class ParkingFeeCalculator {
    
    /**
     * Calculate basic parking fee based on vehicle type and duration.
     */
    public static Money calculateBasicFee(
            VehicleType vehicleType,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            Currency currency) {
        
        long hours = ParkingTimeUtil.calculateParkingHours(entryTime, exitTime);
        
        // Get hourly rate based on vehicle type
        BigDecimal hourlyRate = getHourlyRate(vehicleType);
        
        // Calculate total
        BigDecimal totalAmount = hourlyRate.multiply(BigDecimal.valueOf(hours));
        
        return Money.of(totalAmount, currency);
    }
    
    /**
     * Apply grace period (first 15 minutes free).
     */
    public static Money applyGracePeriod(
            Money baseFee,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            Duration gracePeriod) {
        
        if (ParkingTimeUtil.isWithinGracePeriod(entryTime, exitTime, gracePeriod)) {
            return Money.ofMinor(0, baseFee.currency());
        }
        
        return baseFee;
    }
    
    /**
     * Apply minimum charge (e.g., minimum 1 hour).
     */
    public static Money applyMinimumCharge(
            Money fee,
            Money minimumCharge) {
        
        if (fee.compareTo(minimumCharge) < 0) {
            return minimumCharge;
        }
        
        return fee;
    }
    
    /**
     * Apply discount for long-term parking.
     */
    public static Money applyLongTermDiscount(
            Money fee,
            LocalDateTime entryTime,
            LocalDateTime exitTime) {
        
        long hours = ParkingTimeUtil.calculateParkingHours(entryTime, exitTime);
        
        // 10% discount for > 24 hours
        if (hours > 24) {
            return fee.percent(9000); // 90% of original (10% discount)
        }
        
        return fee;
    }
    
    /**
     * Get hourly rate for vehicle type.
     */
    private static BigDecimal getHourlyRate(VehicleType vehicleType) {
        switch (vehicleType) {
            case MOTORCYCLE:
                return new BigDecimal("10.00");
            case CAR:
                return new BigDecimal("20.00");
            case TRUCK:
                return new BigDecimal("30.00");
            case BUS:
                return new BigDecimal("40.00");
            default:
                return new BigDecimal("20.00");
        }
    }
}
