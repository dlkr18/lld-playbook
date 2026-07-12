package com.you.lld.problems.bookmyshow.api;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import java.util.List;

/**
 * Strategy interface for calculating ticket pricing.
 * Allows different pricing models: base, dynamic, surge, promotional.
 */
public interface PricingStrategy {
    
    /**
     * Calculate total price for given seats in a show.
     * @param show The movie show
     * @param seats List of seats to book
     * @return Total amount in Money
     */
    Money calculatePrice(Show show, List<Seat> seats);
    
    /**
     * Get pricing description/name for display.
     */
    String getDescription();
}
