package com.you.lld.parkinglot.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Represents an individual parking space with its type, availability, and current occupant.
 */
public final class ParkingSpace implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String spaceId;
  private final SpaceType spaceType;
  private final int floorNumber;
  private boolean isOccupied;
  private Vehicle currentVehicle;
  
  public ParkingSpace(String spaceId, SpaceType spaceType, int floorNumber) {
    this.spaceId = Objects.requireNonNull(spaceId, "Space ID cannot be null");
    this.spaceType = Objects.requireNonNull(spaceType, "Space type cannot be null");
    this.floorNumber = floorNumber;
    this.isOccupied = false;
    this.currentVehicle = null;
    
    if (spaceId.trim().isEmpty()) {
      throw new IllegalArgumentException("Space ID cannot be empty");
    }
    if (floorNumber < 0) {
      throw new IllegalArgumentException("Floor number cannot be negative");
    }
  }
  
  /**
   * Attempts to park a vehicle in this space.
   * @param vehicle the vehicle to park
   * @return true if successful, false if space is occupied or incompatible
   */
  public synchronized boolean occupy(Vehicle vehicle) {
    if (isOccupied || !canFit(vehicle.getVehicleType())) {
      return false;
    }
    
    this.isOccupied = true;
    this.currentVehicle = vehicle;
    return true;
  }
  
  /**
   * Removes the vehicle from this space.
   * @return the vehicle that was parked, or null if space was empty
   */
  public synchronized Vehicle vacate() {
    if (!isOccupied) {
      return null;
    }
    
    Vehicle vehicle = this.currentVehicle;
    this.isOccupied = false;
    this.currentVehicle = null;
    return vehicle;
  }
  
  /**
   * Checks if this space can accommodate a vehicle type.
   */
  public boolean canFit(VehicleType vehicleType) {
    // Disabled spaces require disabled permit
    if (spaceType == SpaceType.DISABLED) {
      return false; // This will be checked at a higher level with permit info
    }
    
    return spaceType.canAccommodate(vehicleType);
  }
  
  /**
   * Checks if this space can accommodate a vehicle with disabled permit consideration.
   */
  public boolean canFit(Vehicle vehicle) {
    if (spaceType == SpaceType.DISABLED) {
      return vehicle.hasDisabledPermit() && spaceType.canAccommodate(vehicle.getVehicleType());
    }
    
    return spaceType.canAccommodate(vehicle.getVehicleType());
  }
  
  public String getSpaceId() { return spaceId; }
  public SpaceType getSpaceType() { return spaceType; }
  public int getFloorNumber() { return floorNumber; }
  public boolean isOccupied() { return isOccupied; }
  public boolean isAvailable() { return !isOccupied; }
  public Vehicle getCurrentVehicle() { return currentVehicle; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof ParkingSpace)) return false;
    ParkingSpace that = (ParkingSpace) o;
    return spaceId.equals(that.spaceId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(spaceId);
  }
  
  @Override
  public String toString() {
    return "ParkingSpace{" +
      "spaceId='" + spaceId + '\'' +
      ", spaceType=" + spaceType +
      ", floorNumber=" + floorNumber +
      ", isOccupied=" + isOccupied +
      '}';
  }
}
