package com.you.lld.parkinglot.model;

/**
 * Enumeration of supported vehicle types with their space requirements.
 */
public enum VehicleType {
  MOTORCYCLE(1),
  CAR(2), 
  TRUCK(3),
  BUS(4);
  
  private final int sizeCategory;
  
  VehicleType(int sizeCategory) {
    this.sizeCategory = sizeCategory;
  }
  
  /**
   * Returns the size category for space allocation logic.
   * Higher numbers require larger spaces.
   */
  public int getSizeCategory() {
    return sizeCategory;
  }
}
