package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when refund processing fails.
 */
public class RefundException extends Exception {
  
  public RefundException(String message) {
    super(message);
  }
  
  public RefundException(String message, Throwable cause) {
    super(message, cause);
  }
}
