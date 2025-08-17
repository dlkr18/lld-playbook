package com.you.lld.parkinglot.api.exceptions;

/**
 * Base exception for all parking-related business logic violations.
 * Provides structured error handling with error codes.
 */
public abstract class ParkingException extends Exception {
  private final String errorCode;
  
  protected ParkingException(String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }
  
  protected ParkingException(String errorCode, String message, Throwable cause) {
    super(message, cause);
    this.errorCode = errorCode;
  }
  
  public String getErrorCode() {
    return errorCode;
  }
}
