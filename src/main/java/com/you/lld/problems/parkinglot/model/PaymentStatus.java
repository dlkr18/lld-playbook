package com.you.lld.problems.parkinglot.model;

/**
 * Enumeration of payment transaction states.
 */
public enum PaymentStatus {
  PENDING("Payment initiated, awaiting confirmation"),
  COMPLETED("Payment successfully processed"),
  FAILED("Payment processing failed"),
  REFUNDED("Payment has been refunded"),
  CANCELLED("Payment cancelled by user");
  
  private final String description;
  
  PaymentStatus(String description) {
    this.description = description;
  }
  
  public String getDescription() {
    return description;
  }
  
  public boolean isTerminal() {
    return this == COMPLETED || this == FAILED || this == REFUNDED || this == CANCELLED;
  }
}
