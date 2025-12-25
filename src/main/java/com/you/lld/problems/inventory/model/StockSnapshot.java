package com.you.lld.problems.inventory.model;

import java.io.Serializable;

/**
 * Snapshot of inventory quantities at a moment.
 */
public final class StockSnapshot implements Serializable {
  private static final long serialVersionUID = 1L;
  private final long onHand;
  private final long reserved;

  public StockSnapshot(long onHand, long reserved) {
    if (onHand < 0 || reserved < 0) throw new IllegalArgumentException("Negative quantities not allowed");
    if (reserved > onHand) throw new IllegalArgumentException("Reserved cannot exceed on-hand");
    this.onHand = onHand;
    this.reserved = reserved;
  }

  public long onHand() { return onHand; }
  public long reserved() { return reserved; }
  public long available() { return onHand - reserved; }

  @Override public String toString() {
    return "StockSnapshot{" +
      "onHand=" + onHand +
      ", reserved=" + reserved +
      ", available=" + available() +
      '}';
  }
}


