package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Represents current occupancy statistics for the parking lot.
 */
public final class OccupancyReport implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final LocalDateTime timestamp;
  private final int totalSpaces;
  private final int occupiedSpaces;
  private final Map<SpaceType, Integer> availableByType;
  private final Map<SpaceType, Integer> occupiedByType;
  
  public OccupancyReport(LocalDateTime timestamp, int totalSpaces, int occupiedSpaces,
                        Map<SpaceType, Integer> availableByType, Map<SpaceType, Integer> occupiedByType) {
    this.timestamp = Objects.requireNonNull(timestamp);
    this.totalSpaces = totalSpaces;
    this.occupiedSpaces = occupiedSpaces;
    this.availableByType = new HashMap<>(availableByType);
    this.occupiedByType = new HashMap<>(occupiedByType);
    
    if (totalSpaces < 0 || occupiedSpaces < 0) {
      throw new IllegalArgumentException("Space counts cannot be negative");
    }
    if (occupiedSpaces > totalSpaces) {
      throw new IllegalArgumentException("Occupied spaces cannot exceed total spaces");
    }
  }
  
  public LocalDateTime getTimestamp() { return timestamp; }
  public int getTotalSpaces() { return totalSpaces; }
  public int getOccupiedSpaces() { return occupiedSpaces; }
  public int getAvailableSpaces() { return totalSpaces - occupiedSpaces; }
  public double getOccupancyRate() { return totalSpaces > 0 ? (double) occupiedSpaces / totalSpaces : 0.0; }
  
  public Map<SpaceType, Integer> getAvailableByType() { return availableByType; }
  public Map<SpaceType, Integer> getOccupiedByType() { return occupiedByType; }
  
  public int getAvailableSpaces(SpaceType spaceType) {
    return availableByType.getOrDefault(spaceType, 0);
  }
  
  public int getOccupiedSpaces(SpaceType spaceType) {
    return occupiedByType.getOrDefault(spaceType, 0);
  }
  
  @Override
  public String toString() {
    return "OccupancyReport{" +
      "timestamp=" + timestamp +
      ", totalSpaces=" + totalSpaces +
      ", occupiedSpaces=" + occupiedSpaces +
      ", occupancyRate=" + String.format("%.1f%%", getOccupancyRate() * 100) +
      ", availableByType=" + availableByType +
      '}';
  }
}
