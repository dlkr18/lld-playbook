package com.you.lld.problems.hotelbooking.service;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Room;

import java.math.BigDecimal;

/**
 * Strategy pattern — computes the total price of a stay. Kept as an interface so
 * the pricing policy (flat, seasonal, occupancy-driven, ...) can be swapped at
 * runtime without touching the orchestrator.
 *
 * @param occupancyRatio fraction in [0,1] of same-type rooms already occupied for
 *                       the requested dates, so dynamic strategies can surge; flat
 *                       and seasonal strategies simply ignore it.
 */
public interface PricingStrategy {

    BigDecimal totalFor(Room room, DateRange stay, double occupancyRatio);
}
