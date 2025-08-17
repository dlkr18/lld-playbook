package com.you.lld.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Customer order with line items, delivery details, and fulfillment tracking.
 */
public final class Order implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final OrderId orderId;
  private final UserId userId;
  private final List<OrderLineItem> lineItems;
  private final Address deliveryAddress;
  private final OrderStatus status;
  private final Money subtotal;
  private final Money deliveryFee;
  private final Money taxes;
  private final Money total;
  private final LocalDateTime createdAt;
  private final LocalDateTime expectedDeliveryAt;
  private final WarehouseId assignedWarehouse;
  
  public Order(OrderId orderId, UserId userId, List<OrderLineItem> lineItems, Address deliveryAddress,
               OrderStatus status, Money subtotal, Money deliveryFee, Money taxes, Money total,
               LocalDateTime createdAt, LocalDateTime expectedDeliveryAt, WarehouseId assignedWarehouse) {
    this.orderId = Objects.requireNonNull(orderId);
    this.userId = Objects.requireNonNull(userId);
    this.lineItems = new ArrayList<>(lineItems);
    this.deliveryAddress = Objects.requireNonNull(deliveryAddress);
    this.status = Objects.requireNonNull(status);
    this.subtotal = Objects.requireNonNull(subtotal);
    this.deliveryFee = Objects.requireNonNull(deliveryFee);
    this.taxes = Objects.requireNonNull(taxes);
    this.total = Objects.requireNonNull(total);
    this.createdAt = Objects.requireNonNull(createdAt);
    this.expectedDeliveryAt = expectedDeliveryAt;
    this.assignedWarehouse = assignedWarehouse;
  }
  
  public OrderId orderId() { return orderId; }
  public UserId userId() { return userId; }
  public List<OrderLineItem> lineItems() { return lineItems; }
  public Address deliveryAddress() { return deliveryAddress; }
  public OrderStatus status() { return status; }
  public Money subtotal() { return subtotal; }
  public Money deliveryFee() { return deliveryFee; }
  public Money taxes() { return taxes; }
  public Money total() { return total; }
  public LocalDateTime createdAt() { return createdAt; }
  public LocalDateTime expectedDeliveryAt() { return expectedDeliveryAt; }
  public WarehouseId assignedWarehouse() { return assignedWarehouse; }
  
  @Override
  public String toString() {
    return "Order{" +
      "orderId=" + orderId +
      ", userId=" + userId +
      ", status=" + status +
      ", total=" + total +
      ", itemCount=" + lineItems.size() +
      '}';
  }
}
