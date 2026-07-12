package com.you.lld.problems.carrental.service;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.DateRange;

import java.math.BigDecimal;

/**
 * Strategy for computing the base rental cost of a car over a period.
 *
 * <p>Swapping the implementation (daily flat rate, weekly-discount, seasonal
 * surge) changes pricing without touching reservation or inventory logic.
 * Implementations must be stateless / thread-safe: a single instance is shared
 * across all concurrent reservations.
 */
public interface PricingStrategy {

    /** Base cost (excluding any late fee) for renting a {@code type} car over {@code period}. */
    BigDecimal price(CarType type, DateRange period);
}
