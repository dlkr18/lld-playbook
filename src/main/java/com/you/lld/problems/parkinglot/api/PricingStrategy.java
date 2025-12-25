package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.common.Money;

/**
 * Strategy interface for different pricing models.
 * Allows pluggable pricing algorithms (hourly, flat rate, dynamic, etc.).
 */
public interface PricingStrategy {
  
  /**
   * Calculates parking fee based on ticket details.
   * 
   * @param ticket parking ticket with entry/exit times and vehicle details
   * @return calculated parking fee
   * @throws IllegalArgumentException if ticket data is insufficient
   */
  Money calculateFee(ParkingTicket ticket);
  
  /**
   * Returns a description of this pricing strategy.
   * 
   * @return human-readable strategy description
   */
  String getDescription();
}
