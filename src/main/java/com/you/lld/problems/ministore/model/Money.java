package com.you.lld.problems.ministore.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Immutable money value object. BigDecimal (never double) at scale 2, HALF_EVEN.
 * Value semantics: two Money of equal amount are equal.
 */
public final class Money {

    private final BigDecimal amount;

    private Money(BigDecimal amount) {
        if (amount == null) {
            throw new IllegalArgumentException("amount is required");
        }
        if (amount.signum() < 0) {
            throw new IllegalArgumentException("money cannot be negative: " + amount);
        }
        this.amount = amount.setScale(2, RoundingMode.HALF_EVEN);
    }

    public static Money of(String amount) { return new Money(new BigDecimal(amount)); }
    public static Money of(BigDecimal amount) { return new Money(amount); }
    public static Money zero() { return new Money(BigDecimal.ZERO); }

    public Money plus(Money other) { return new Money(this.amount.add(other.amount)); }
    public Money times(int qty) { return new Money(this.amount.multiply(BigDecimal.valueOf(qty))); }

    public BigDecimal amount() { return amount; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money)) return false;
        return amount.compareTo(((Money) o).amount) == 0;
    }

    @Override
    public int hashCode() { return Objects.hash(amount.stripTrailingZeros()); }

    @Override
    public String toString() { return "$" + amount.toPlainString(); }
}
