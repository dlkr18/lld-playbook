package com.you.lld.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Payment record with method, status, and gateway details.
 */
public final class Payment implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final PaymentId paymentId;
  private final OrderId orderId;
  private final UserId userId;
  private final Money amount;
  private final PaymentMethod method;
  private final PaymentStatus status;
  private final String gatewayTransactionId;
  private final LocalDateTime createdAt;
  private final LocalDateTime processedAt;
  
  public Payment(PaymentId paymentId, OrderId orderId, UserId userId, Money amount,
                 PaymentMethod method, PaymentStatus status, String gatewayTransactionId,
                 LocalDateTime createdAt, LocalDateTime processedAt) {
    this.paymentId = Objects.requireNonNull(paymentId);
    this.orderId = Objects.requireNonNull(orderId);
    this.userId = Objects.requireNonNull(userId);
    this.amount = Objects.requireNonNull(amount);
    this.method = Objects.requireNonNull(method);
    this.status = Objects.requireNonNull(status);
    this.gatewayTransactionId = gatewayTransactionId;
    this.createdAt = Objects.requireNonNull(createdAt);
    this.processedAt = processedAt;
  }
  
  public PaymentId paymentId() { return paymentId; }
  public OrderId orderId() { return orderId; }
  public UserId userId() { return userId; }
  public Money amount() { return amount; }
  public PaymentMethod method() { return method; }
  public PaymentStatus status() { return status; }
  public String gatewayTransactionId() { return gatewayTransactionId; }
  public LocalDateTime createdAt() { return createdAt; }
  public LocalDateTime processedAt() { return processedAt; }
  
  public boolean isSuccessful() { return status == PaymentStatus.SUCCESS; }
  
  @Override
  public String toString() {
    return "Payment{" +
      "paymentId=" + paymentId +
      ", orderId=" + orderId +
      ", amount=" + amount +
      ", method=" + method +
      ", status=" + status +
      '}';
  }
}
