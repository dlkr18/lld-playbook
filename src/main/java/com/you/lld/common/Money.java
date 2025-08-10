package com.you.lld.common;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Objects;

/**
 * Immutable Money value object. Stores amount as minor units (long) and a Currency.
 * Avoids floating-point errors; supports arithmetic with scale safety.
 */
public final class Money implements Comparable<Money>, Serializable {
  private static final long serialVersionUID = 1L;

  private final long minor; // e.g., cents
  private final Currency currency;

  private Money(long minor, Currency currency) {
    this.minor = minor;
    this.currency = Objects.requireNonNull(currency);
  }

  public static Money ofMinor(long minor, Currency currency) {
    return new Money(minor, currency);
  }

  public static Money of(BigDecimal amount, Currency currency) {
    Objects.requireNonNull(amount);
    int scale = currency.getDefaultFractionDigits();
    BigDecimal scaled = amount.setScale(scale, RoundingMode.HALF_EVEN);
    long minor = scaled.movePointRight(scale).longValueExact();
    return new Money(minor, currency);
  }

  public long minor() { return minor; }
  public Currency currency() { return currency; }

  public BigDecimal toBigDecimal() {
    int scale = currency.getDefaultFractionDigits();
    return BigDecimal.valueOf(minor, scale);
  }

  public Money plus(Money other) {
    requireSameCurrency(other);
    return new Money(Math.addExact(this.minor, other.minor), currency);
  }

  public Money minus(Money other) {
    requireSameCurrency(other);
    return new Money(Math.subtractExact(this.minor, other.minor), currency);
  }

  public Money times(long factor) {
    return new Money(Math.multiplyExact(this.minor, factor), currency);
  }

  public Money percent(int basisPoints) {
    // basisPoints: 10000 = 100%
    long result = (this.minor * basisPoints) / 10000L;
    return new Money(result, currency);
  }

  public boolean isNegative() { return minor < 0; }
  public boolean isZero() { return minor == 0; }
  public boolean isPositive() { return minor > 0; }

  private void requireSameCurrency(Money other) {
    if (!this.currency.equals(other.currency))
      throw new IllegalArgumentException("Currency mismatch: " + currency + " vs " + other.currency);
  }

  @Override public int compareTo(Money o) {
    requireSameCurrency(o);
    return Long.compare(this.minor, o.minor);
  }

  @Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Money)) return false;
    Money money = (Money) o;
    return minor == money.minor && currency.equals(money.currency);
  }

  @Override public int hashCode() { return Objects.hash(minor, currency); }

  @Override public String toString() {
    return currency.getCurrencyCode() + " " + toBigDecimal();
  }
}
