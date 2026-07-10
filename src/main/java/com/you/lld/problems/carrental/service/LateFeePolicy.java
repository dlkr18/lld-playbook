package com.you.lld.problems.carrental.service;

import com.you.lld.problems.carrental.model.CarType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Strategy for computing the late fee when a car is returned after the scheduled
 * drop-off. Kept separate from {@link PricingStrategy} because late-fee policy
 * changes independently of the base tariff (e.g. a grace-period promotion should
 * not require touching daily rates).
 *
 * <p>Implementations must be stateless / thread-safe.
 */
public interface LateFeePolicy {

    /**
     * @param type              the car category (fee usually scales with its rate)
     * @param scheduledDropoff  when the car was due back
     * @param actualReturn      when it was actually returned
     * @return the late fee (never negative; {@link BigDecimal#ZERO} if on time / early)
     */
    BigDecimal lateFee(CarType type, LocalDateTime scheduledDropoff, LocalDateTime actualReturn);
}
