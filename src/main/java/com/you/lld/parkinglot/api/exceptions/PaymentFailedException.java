package com.you.lld.parkinglot.api.exceptions;

/**
 * Thrown when payment processing fails due to insufficient funds, 
 * network issues, or other payment gateway problems.
 */
public class PaymentFailedException extends ParkingException {
  
  public PaymentFailedException(String reason) {
    super("PAYMENT_FAILED", "Payment processing failed: " + reason);
  }
  
  public PaymentFailedException(String reason, Throwable cause) {
    super("PAYMENT_FAILED", "Payment processing failed: " + reason, cause);
  }
}
