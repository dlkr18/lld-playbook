package com.you.lld.parkinglot.api.exceptions;

/**
 * Thrown when vehicle data is invalid or incomplete.
 */
public class InvalidVehicleException extends ParkingException {
  
  public InvalidVehicleException(String message) {
    super("INVALID_VEHICLE", message);
  }
  
  public InvalidVehicleException(String message, Throwable cause) {
    super("INVALID_VEHICLE", message, cause);
  }
}
