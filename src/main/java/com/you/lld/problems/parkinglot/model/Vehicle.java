package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Represents a vehicle with its identifying information and parking requirements.
 */
public final class Vehicle implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String licenseNumber;
  private final VehicleType vehicleType;
  private final boolean hasDisabledPermit;
  
  public Vehicle(String licenseNumber, VehicleType vehicleType, boolean hasDisabledPermit) {
    this.licenseNumber = Objects.requireNonNull(licenseNumber, "License number cannot be null");
    this.vehicleType = Objects.requireNonNull(vehicleType, "Vehicle type cannot be null");
    this.hasDisabledPermit = hasDisabledPermit;
    
    if (licenseNumber.trim().isEmpty()) {
      throw new IllegalArgumentException("License number cannot be empty");
    }
  }
  
  public Vehicle(String licenseNumber, VehicleType vehicleType) {
    this(licenseNumber, vehicleType, false);
  }
  
  public String getLicenseNumber() { return licenseNumber; }
  public VehicleType getVehicleType() { return vehicleType; }
  public boolean hasDisabledPermit() { return hasDisabledPermit; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Vehicle)) return false;
    Vehicle vehicle = (Vehicle) o;
    return licenseNumber.equals(vehicle.licenseNumber);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(licenseNumber);
  }
  
  @Override
  public String toString() {
    return "Vehicle{" +
      "licenseNumber='" + licenseNumber + '\'' +
      ", vehicleType=" + vehicleType +
      ", hasDisabledPermit=" + hasDisabledPermit +
      '}';
  }
}
