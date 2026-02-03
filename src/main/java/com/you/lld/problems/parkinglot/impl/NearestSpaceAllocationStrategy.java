package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.*;

/**
 * Space allocation strategy that selects the nearest available space.
 * Prioritizes lower floor numbers and optimal space type for the vehicle.
 */
public class NearestSpaceAllocationStrategy implements SpaceAllocationStrategy {
  
  private static final Map<VehicleType, List<SpaceType>> SPACE_PRIORITY;
  
  static {
    SPACE_PRIORITY = new HashMap<>();
    
    // Motorcycles prefer motorcycle spaces, then compact, then large
    SPACE_PRIORITY.put(VehicleType.MOTORCYCLE, Arrays.asList(
        SpaceType.MOTORCYCLE, SpaceType.COMPACT, SpaceType.LARGE
    ));
    
    // Cars prefer compact spaces, then large
    SPACE_PRIORITY.put(VehicleType.CAR, Arrays.asList(
        SpaceType.COMPACT, SpaceType.LARGE
    ));
    
    // Trucks and buses need large spaces only
    SPACE_PRIORITY.put(VehicleType.TRUCK, Collections.singletonList(SpaceType.LARGE));
    SPACE_PRIORITY.put(VehicleType.BUS, Collections.singletonList(SpaceType.LARGE));
  }
  
  @Override
  public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, VehicleType vehicleType) {
    if (availableSpaces == null || availableSpaces.isEmpty()) {
      return Optional.empty();
    }
    
    if (vehicleType == null) {
      return Optional.empty();
    }
    
    List<SpaceType> preferredTypes = SPACE_PRIORITY.get(vehicleType);
    if (preferredTypes == null) {
      return Optional.empty();
    }
    
    // Try to find space in order of preference
    for (SpaceType preferredType : preferredTypes) {
      Optional<ParkingSpace> space = findNearestSpaceOfType(availableSpaces, preferredType);
      if (space.isPresent()) {
        return space;
      }
    }
    
    // Fallback: return any available space that can fit the vehicle
    return availableSpaces.stream()
        .filter(space -> space.canFit(vehicleType))
        .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
            .thenComparing(ParkingSpace::getSpaceId));
  }
  
  /**
   * Finds the nearest (lowest floor) space of a specific type.
   */
  private Optional<ParkingSpace> findNearestSpaceOfType(List<ParkingSpace> spaces, SpaceType spaceType) {
    return spaces.stream()
        .filter(space -> space.getSpaceType() == spaceType)
        .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
            .thenComparing(ParkingSpace::getSpaceId));
  }
  
  @Override
  public String getDescription() {
    return "Nearest space allocation strategy - prioritizes lower floors and optimal space types";
  }
}
