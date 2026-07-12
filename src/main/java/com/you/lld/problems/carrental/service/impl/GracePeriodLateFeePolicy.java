package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.service.LateFeePolicy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Decorates another {@link LateFeePolicy} with a grace window: returns within
 * {@code graceHours} of the scheduled drop-off are free; beyond the grace the
 * delegate policy is applied (measured from the original drop-off, so the grace
 * forgives lateness but does not shift the meter). Immutable / thread-safe.
 */
public final class GracePeriodLateFeePolicy implements LateFeePolicy {

    private final LateFeePolicy delegate;
    private final long graceHours;

    public GracePeriodLateFeePolicy(LateFeePolicy delegate, long graceHours) {
        if (delegate == null) {
            throw new IllegalArgumentException("delegate policy required");
        }
        if (graceHours < 0) {
            throw new IllegalArgumentException("graceHours must be non-negative");
        }
        this.delegate = delegate;
        this.graceHours = graceHours;
    }

    @Override
    public BigDecimal lateFee(CarType type, LocalDateTime scheduledDropoff, LocalDateTime actualReturn) {
        if (scheduledDropoff == null || actualReturn == null) {
            throw new IllegalArgumentException("timestamps required");
        }
        LocalDateTime graceEnd = scheduledDropoff.plusHours(graceHours);
        if (!actualReturn.isAfter(graceEnd)) {
            return BigDecimal.ZERO;
        }
        return delegate.lateFee(type, scheduledDropoff, actualReturn);
    }
}
