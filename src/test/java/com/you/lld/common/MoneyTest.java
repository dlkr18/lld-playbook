package com.you.lld.common;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Currency;

import static org.junit.jupiter.api.Assertions.*;

public class MoneyTest {
  @Test
  void createsFromBigDecimalAndMinorUnits() {
    Currency usd = Currency.getInstance("USD");
    Money m1 = Money.of(new BigDecimal("12.34"), usd);
    Money m2 = Money.ofMinor(1234, usd);
    assertEquals(m2, m1);
    assertEquals(new BigDecimal("12.34"), m1.toBigDecimal());
  }

  @Test
  void arithmeticAndComparison() {
    Currency usd = Currency.getInstance("USD");
    Money a = Money.ofMinor(1000, usd);
    Money b = Money.ofMinor(250, usd);
    assertEquals(Money.ofMinor(1250, usd), a.plus(b));
    assertEquals(Money.ofMinor(750, usd), a.minus(b));
    assertEquals(0, a.compareTo(Money.ofMinor(1000, usd)));
    assertTrue(a.compareTo(b) > 0);
  }

  @Test
  void currencyMismatchThrows() {
    Money usd = Money.ofMinor(100, Currency.getInstance("USD"));
    Money eur = Money.ofMinor(100, Currency.getInstance("EUR"));
    assertThrows(IllegalArgumentException.class, () -> usd.plus(eur));
  }
}
