package com.you.lld.problems.bookmyshow.util;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.model.Seat;

import java.util.Currency;
import java.util.List;

/**
 * Utility class for price calculations.
 */
public class PriceCalculator {
    
    /**
     * Calculate base price from seats.
     */
    public static Money calculateBasePrice(List<Seat> seats, Currency currency) {
        long totalMinor = seats.stream()
            .mapToLong(seat -> {
                // Convert double price to minor units (cents)
                return (long) (seat.getPrice() * Math.pow(10, currency.getDefaultFractionDigits()));
            })
            .sum();
        
        return Money.ofMinor(totalMinor, currency);
    }
    
    /**
     * Apply discount percentage.
     */
    public static Money applyDiscount(Money price, double discountPercent) {
        if (discountPercent <= 0) return price;
        if (discountPercent >= 100) return Money.ofMinor(0, price.currency());
        
        // Calculate discount amount
        int basisPoints = (int) ((100 - discountPercent) * 100);
        return price.percent(basisPoints);
    }
    
    /**
     * Apply promo code discount.
     */
    public static Money applyPromoCode(Money price, String promoCode) {
        // Simplified promo code logic
        if (promoCode == null || promoCode.isEmpty()) {
            return price;
        }
        
        // Example promo codes
        switch (promoCode.toUpperCase()) {
            case "FIRST50":
                return applyDiscount(price, 50); // 50% off
            case "WELCOME20":
                return applyDiscount(price, 20); // 20% off
            case "SAVE10":
                return applyDiscount(price, 10); // 10% off
            default:
                return price; // Invalid promo code
        }
    }
    
    /**
     * Calculate service fee (booking fee).
     */
    public static Money calculateServiceFee(Money bookingAmount) {
        // Example: 2% service fee
        return bookingAmount.percent(200); // 200 basis points = 2%
    }
    
    /**
     * Calculate total with taxes.
     */
    public static Money calculateWithTax(Money price, double taxPercent) {
        int basisPoints = (int) ((100 + taxPercent) * 100);
        return price.percent(basisPoints);
    }
}
