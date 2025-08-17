package com.you.lld.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.util.Objects;

/**
 * Individual item in an order with quantity and pricing.
 */
public final class OrderLineItem implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final SkuId skuId;
  private final String productName;
  private final long quantity;
  private final Money unitPrice;
  private final Money lineTotal;
  private final ReservationId reservationId; // null until reserved
  
  public OrderLineItem(SkuId skuId, String productName, long quantity, Money unitPrice, ReservationId reservationId) {
    if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
    this.skuId = Objects.requireNonNull(skuId);
    this.productName = Objects.requireNonNull(productName);
    this.quantity = quantity;
    this.unitPrice = Objects.requireNonNull(unitPrice);
    this.lineTotal = unitPrice.times(quantity);
    this.reservationId = reservationId; // can be null initially
  }
  
  public SkuId skuId() { return skuId; }
  public String productName() { return productName; }
  public long quantity() { return quantity; }
  public Money unitPrice() { return unitPrice; }
  public Money lineTotal() { return lineTotal; }
  public ReservationId reservationId() { return reservationId; }
  
  public boolean isReserved() { return reservationId != null; }
  
  public OrderLineItem withReservation(ReservationId reservationId) {
    return new OrderLineItem(skuId, productName, quantity, unitPrice, reservationId);
  }
  
  @Override
  public String toString() {
    return "OrderLineItem{" +
      "skuId=" + skuId +
      ", productName='" + productName + '\'' +
      ", quantity=" + quantity +
      ", lineTotal=" + lineTotal +
      ", reserved=" + isReserved() +
      '}';
  }
}
