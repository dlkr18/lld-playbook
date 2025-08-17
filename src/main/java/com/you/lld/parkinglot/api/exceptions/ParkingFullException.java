package com.you.lld.parkinglot.api.exceptions;

import com.you.lld.parkinglot.model.VehicleType;

/**
 * Thrown when no suitable parking space is available for a vehicle.
 */
public class ParkingFullException extends ParkingException {
  
  public ParkingFullException(VehicleType vehicleType) {
    super("PARKING_FULL", "No available parking space for vehicle type: " + vehicleType);
  }
}
