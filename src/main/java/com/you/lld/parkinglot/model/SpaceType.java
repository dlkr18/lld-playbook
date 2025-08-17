package com.you.lld.parkinglot.model;

/**
 * Enumeration of parking space types with their capacity and vehicle compatibility.
 */
public enum SpaceType {
  MOTORCYCLE(1, "Motorcycle spaces"),
  COMPACT(2, "Compact car spaces"),
  LARGE(4, "Large vehicle spaces"),
  DISABLED(2, "Disabled-accessible spaces");
  
  private final int capacity;
  private final String description;
  
  SpaceType(int capacity, String description) {
    this.capacity = capacity;
    this.description = description;
  }
  
  /**
   * Returns the capacity rating for this space type.
   * Used to determine vehicle compatibility.
   */
  public int getCapacity() {
    return capacity;
  }
  
  /**
   * Returns human-readable description of this space type.
   */
  public String getDescription() {
    return description;
  }
  
  /**
   * Checks if this space type can accommodate a vehicle type.
   */
  public boolean canAccommodate(VehicleType vehicleType) {
    return this.capacity >= vehicleType.getSizeCategory();
  }
}
