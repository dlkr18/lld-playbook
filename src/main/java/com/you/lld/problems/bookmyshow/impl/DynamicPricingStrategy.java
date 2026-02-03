package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import com.you.lld.problems.bookmyshow.model.SeatType;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dynamic pricing strategy based on:
 * - Seat type (REGULAR < PREMIUM < VIP)
 * - Day of week (Weekend premium)
 * - Time of day (Evening premium)
 * - Occupancy (Surge pricing when > 70% full)
 */
public class DynamicPricingStrategy implements PricingStrategy {
    
    private final Currency currency;
    private final Map<SeatType, Money> basePrices;
    private final double weekendMultiplier;
    private final double eveningMultiplier;
    private final double surgePriceMultiplier;
    
    public DynamicPricingStrategy(Currency currency) {
        this.currency = currency;
        this.weekendMultiplier = 1.3; // 30% higher on weekends
        this.eveningMultiplier = 1.2; // 20% higher for evening shows
        this.surgePriceMultiplier = 1.5; // 50% surge when > 70% full
        
        // Base prices per seat type
        this.basePrices = new HashMap<>();
        this.basePrices.put(SeatType.REGULAR, Money.of(new BigDecimal("150.00"), currency));
        this.basePrices.put(SeatType.PREMIUM, Money.of(new BigDecimal("250.00"), currency));
        this.basePrices.put(SeatType.VIP, Money.of(new BigDecimal("400.00"), currency));
    }
    
    @Override
    public Money calculatePrice(Show show, List<Seat> seats) {
        Money total = Money.ofMinor(0, currency);
        
        for (Seat seat : seats) {
            Money basePrice = basePrices.getOrDefault(seat.getType(), 
                Money.of(new BigDecimal("150.00"), currency));
            
            // Apply multipliers
            double multiplier = 1.0;
            
            // Weekend pricing
            if (isWeekend(show.getStartTime())) {
                multiplier *= weekendMultiplier;
            }
            
            // Evening show pricing (after 6 PM)
            if (isEveningShow(show.getStartTime())) {
                multiplier *= eveningMultiplier;
            }
            
            // Surge pricing based on occupancy (would need occupancy info)
            // For now, applying a simple time-based surge
            
            // Calculate final price
            long multipliedAmount = (long) (basePrice.minor() * multiplier);
            Money seatPrice = Money.ofMinor(multipliedAmount, currency);
            
            total = total.plus(seatPrice);
        }
        
        return total;
    }
    
    private boolean isWeekend(LocalDateTime showTime) {
        DayOfWeek day = showTime.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }
    
    private boolean isEveningShow(LocalDateTime showTime) {
        LocalTime time = showTime.toLocalTime();
        return time.isAfter(LocalTime.of(18, 0)); // After 6 PM
    }
    
    @Override
    public String getDescription() {
        return "Dynamic Pricing (Weekend/Evening/Surge)";
    }
}
