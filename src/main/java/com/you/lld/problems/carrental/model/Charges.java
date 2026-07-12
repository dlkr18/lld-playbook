package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Immutable breakdown of what a completed rental cost: the base rental amount
 * (quoted at reservation time) plus any late fee assessed at return.
 */
public final class Charges {
    private final BigDecimal baseCost;
    private final BigDecimal lateFee;

    public Charges(BigDecimal baseCost, BigDecimal lateFee) {
        if (baseCost == null || lateFee == null) {
            throw new IllegalArgumentException("baseCost and lateFee required");
        }
        if (baseCost.signum() < 0 || lateFee.signum() < 0) {
            throw new IllegalArgumentException("charges cannot be negative");
        }
        this.baseCost = baseCost;
        this.lateFee = lateFee;
    }

    public BigDecimal getBaseCost() {
        return baseCost;
    }

    public BigDecimal getLateFee() {
        return lateFee;
    }

    public BigDecimal getTotal() {
        return baseCost.add(lateFee);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Charges that = (Charges) o;
        return baseCost.compareTo(that.baseCost) == 0 && lateFee.compareTo(that.lateFee) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(baseCost.stripTrailingZeros(), lateFee.stripTrailingZeros());
    }

    @Override
    public String toString() {
        return "base=" + baseCost + ", lateFee=" + lateFee + ", total=" + getTotal();
    }
}
