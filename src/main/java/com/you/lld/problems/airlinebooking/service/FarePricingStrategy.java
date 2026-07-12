package com.you.lld.problems.airlinebooking.service;

import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.SeatClass;

import java.math.BigDecimal;

/**
 * Strategy: computes the fare for a seat in a given cabin class on a flight.
 *
 * <p>Swapping the implementation (flat class-based vs demand-based dynamic
 * pricing) changes pricing behaviour without touching the booking orchestrator.
 */
public interface FarePricingStrategy {

    BigDecimal price(Flight flight, SeatClass seatClass);
}
