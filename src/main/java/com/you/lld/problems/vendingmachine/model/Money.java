package com.you.lld.problems.vendingmachine.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Immutable value object representing monetary amounts.
 * Uses BigDecimal for precise financial calculations.
 */
public final class Money implements Comparable<Money> {
    
    public static final Money ZERO = new Money(BigDecimal.ZERO);
    public static final Money PENNY = cents(1);
    public static final Money NICKEL = cents(5);
    public static final Money DIME = cents(10);
    public static final Money QUARTER = cents(25);
    public static final Money DOLLAR = dollars(1);
    public static final Money FIVE_DOLLARS = dollars(5);
    
    private final BigDecimal amount;
    
    private Money(BigDecimal amount) {
        this.amount = amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    public static Money of(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be null or negative");
        }
        return new Money(amount);
    }
    
    public static Money dollars(int dollars) {
        return new Money(BigDecimal.valueOf(dollars));
    }
    
    public static Money dollars(double dollars) {
        return new Money(BigDecimal.valueOf(dollars));
    }
    
    public static Money cents(int cents) {
        return new Money(BigDecimal.valueOf(cents).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
    }
    
    public Money add(Money other) {
        if (other == null) {
            return this;
        }
        return new Money(this.amount.add(other.amount));
    }
    
    public Money subtract(Money other) {
        if (other == null) {
            return this;
        }
        BigDecimal result = this.amount.subtract(other.amount);
        if (result.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Result cannot be negative");
        }
        return new Money(result);
    }
    
    public boolean isGreaterThanOrEqual(Money other) {
        return this.amount.compareTo(other.amount) >= 0;
    }
    
    public boolean isGreaterThan(Money other) {
        return this.amount.compareTo(other.amount) > 0;
    }
    
    public boolean isLessThan(Money other) {
        return this.amount.compareTo(other.amount) < 0;
    }
    
    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public int getCents() {
        return amount.multiply(BigDecimal.valueOf(100)).intValue();
    }
    
    @Override
    public int compareTo(Money other) {
        return this.amount.compareTo(other.amount);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Money money = (Money) obj;
        return amount.compareTo(money.amount) == 0;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(amount);
    }
    
    @Override
    public String toString() {
        return "$" + amount.toString();
    }
}
