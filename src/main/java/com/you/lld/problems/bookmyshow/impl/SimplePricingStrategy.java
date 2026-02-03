package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import com.you.lld.problems.bookmyshow.model.SeatType;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Simple flat pricing based only on seat type.
 * No time-based or occupancy-based variations.
 */
public class SimplePricingStrategy implements PricingStrategy {
    
    private final Currency currency;
    private final Map<SeatType, Money> prices;
    
    public SimplePricingStrategy(Currency currency) {
        this.currency = currency;
        this.prices = new HashMap<>();
        
        // Flat prices per seat type
        this.prices.put(SeatType.REGULAR, Money.of(new BigDecimal("120.00"), currency));
        this.prices.put(SeatType.PREMIUM, Money.of(new BigDecimal("200.00"), currency));
        this.prices.put(SeatType.VIP, Money.of(new BigDecimal("350.00"), currency));
    }
    
    @Override
    public Money calculatePrice(Show show, List<Seat> seats) {
        Money total = Money.ofMinor(0, currency);
        
        for (Seat seat : seats) {
            Money seatPrice = prices.getOrDefault(seat.getType(), 
                Money.of(new BigDecimal("120.00"), currency));
            total = total.plus(seatPrice);
        }
        
        return total;
    }
    
    @Override
    public String getDescription() {
        return "Simple Flat Pricing";
    }
}
