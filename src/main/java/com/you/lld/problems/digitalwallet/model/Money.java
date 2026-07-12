package com.you.lld.problems.digitalwallet.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Immutable, single-currency money value object backed by {@link BigDecimal}.
 *
 * <p>All amounts are normalised to scale 2 with banker's rounding
 * ({@link RoundingMode#HALF_EVEN}). We deliberately never use {@code double}:
 * binary floating point cannot represent 0.10 exactly, which is fatal for money.
 *
 * <p>The type is a self-validating value object — it carries no business logic
 * beyond arithmetic and sign checks, per the repo model conventions.
 */
public final class Money implements Comparable<Money>, Serializable {
    private static final long serialVersionUID = 1L;
    private static final int SCALE = 2;

    public static final Money ZERO = new Money(BigDecimal.ZERO.setScale(SCALE, RoundingMode.HALF_EVEN));

    private final BigDecimal amount;

    private Money(BigDecimal amount) {
        this.amount = amount;
    }

    public static Money of(BigDecimal amount) {
        Objects.requireNonNull(amount, "amount");
        return new Money(amount.setScale(SCALE, RoundingMode.HALF_EVEN));
    }

    public static Money of(String amount) {
        Objects.requireNonNull(amount, "amount");
        return of(new BigDecimal(amount));
    }

    public BigDecimal toBigDecimal() {
        return amount;
    }

    public Money plus(Money other) {
        return new Money(this.amount.add(other.amount));
    }

    public Money minus(Money other) {
        return new Money(this.amount.subtract(other.amount));
    }

    public Money negate() {
        return new Money(this.amount.negate());
    }

    public boolean isNegative() {
        return amount.signum() < 0;
    }

    public boolean isZero() {
        return amount.signum() == 0;
    }

    public boolean isPositive() {
        return amount.signum() > 0;
    }

    /** True if this amount is strictly less than {@code other}. */
    public boolean isLessThan(Money other) {
        return compareTo(other) < 0;
    }

    @Override
    public int compareTo(Money o) {
        return this.amount.compareTo(o.amount);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money)) return false;
        Money money = (Money) o;
        // Compare by value, not scale: 1.0 and 1.00 are the same money.
        return amount.compareTo(money.amount) == 0;
    }

    @Override
    public int hashCode() {
        return amount.stripTrailingZeros().hashCode();
    }

    @Override
    public String toString() {
        return amount.toPlainString();
    }
}
