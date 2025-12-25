package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.VehicleType;
import java.util.List;
import java.util.Optional;

/**
 * Strategy interface for different space allocation algorithms.
 * Allows pluggable allocation logic (nearest to entrance, by floor, etc.).
 */
public interface SpaceAllocationStrategy {
  
  /**
   * Selects the best available parking space for a vehicle type.
   * 
   * @param availableSpaces list of currently available spaces
   * @param vehicleType type of vehicle requesting parking
   * @return optimal parking space if available, empty otherwise
   */
  Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, VehicleType vehicleType);
  
  /**
   * Returns a description of this allocation strategy.
   * 
   * @return human-readable strategy description
   */
  String getDescription();
}
