package com.you.lld.parkinglot.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a payment transaction for parking fees.
 */
public final class Payment implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String paymentId;
  private final ParkingTicket ticket;
  private final Money amount;
  private final PaymentMethod paymentMethod;
  private PaymentStatus status;
  private final LocalDateTime timestamp;
  private String transactionReference;
  
  public Payment(String paymentId, ParkingTicket ticket, Money amount, PaymentMethod paymentMethod) {
    this.paymentId = Objects.requireNonNull(paymentId, "Payment ID cannot be null");
    this.ticket = Objects.requireNonNull(ticket, "Parking ticket cannot be null");
    this.amount = Objects.requireNonNull(amount, "Amount cannot be null");
    this.paymentMethod = Objects.requireNonNull(paymentMethod, "Payment method cannot be null");
    this.status = PaymentStatus.PENDING;
    this.timestamp = LocalDateTime.now();
    
    if (paymentId.trim().isEmpty()) {
      throw new IllegalArgumentException("Payment ID cannot be empty");
    }
    if (amount.isNegative()) {
      throw new IllegalArgumentException("Payment amount cannot be negative");
    }
  }
  
  /**
   * Marks this payment as successfully processed.
   */
  public void markCompleted(String transactionReference) {
    if (status.isTerminal()) {
      throw new IllegalStateException("Payment is already in terminal state: " + status);
    }
    
    this.status = PaymentStatus.COMPLETED;
    this.transactionReference = transactionReference;
  }
  
  /**
   * Marks this payment as failed.
   */
  public void markFailed() {
    if (status.isTerminal()) {
      throw new IllegalStateException("Payment is already in terminal state: " + status);
    }
    
    this.status = PaymentStatus.FAILED;
  }
  
  /**
   * Marks this payment as refunded.
   */
  public void markRefunded(String refundReference) {
    if (status != PaymentStatus.COMPLETED) {
      throw new IllegalStateException("Can only refund completed payments");
    }
    
    this.status = PaymentStatus.REFUNDED;
    this.transactionReference = refundReference;
  }
  
  public String getPaymentId() { return paymentId; }
  public ParkingTicket getTicket() { return ticket; }
  public Money getAmount() { return amount; }
  public PaymentMethod getPaymentMethod() { return paymentMethod; }
  public PaymentStatus getStatus() { return status; }
  public LocalDateTime getTimestamp() { return timestamp; }
  public String getTransactionReference() { return transactionReference; }
  
  public boolean isSuccessful() { return status == PaymentStatus.COMPLETED; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Payment)) return false;
    Payment payment = (Payment) o;
    return paymentId.equals(payment.paymentId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(paymentId);
  }
  
  @Override
  public String toString() {
    return "Payment{" +
      "paymentId='" + paymentId + '\'' +
      ", ticketId='" + ticket.getTicketId() + '\'' +
      ", amount=" + amount +
      ", paymentMethod=" + paymentMethod +
      ", status=" + status +
      ", timestamp=" + timestamp +
      '}';
  }
}
