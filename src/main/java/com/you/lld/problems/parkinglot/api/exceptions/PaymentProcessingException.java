package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when payment processing encounters technical issues.
 */
public class PaymentProcessingException extends Exception {
  
  public PaymentProcessingException(String message) {
    super(message);
  }
  
  public PaymentProcessingException(String message, Throwable cause) {
    super(message, cause);
  }
}
