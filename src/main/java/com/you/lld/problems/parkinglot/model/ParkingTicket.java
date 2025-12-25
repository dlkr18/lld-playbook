package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a parking ticket issued when a vehicle enters the parking lot.
 */
public final class ParkingTicket implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String ticketId;
  private final Vehicle vehicle;
  private final ParkingSpace parkingSpace;
  private final LocalDateTime entryTime;
  private LocalDateTime exitTime;
  private boolean isActive;
  
  public ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpace parkingSpace, LocalDateTime entryTime) {
    this.ticketId = Objects.requireNonNull(ticketId, "Ticket ID cannot be null");
    this.vehicle = Objects.requireNonNull(vehicle, "Vehicle cannot be null");
    this.parkingSpace = Objects.requireNonNull(parkingSpace, "Parking space cannot be null");
    this.entryTime = Objects.requireNonNull(entryTime, "Entry time cannot be null");
    this.exitTime = null;
    this.isActive = true;
    
    if (ticketId.trim().isEmpty()) {
      throw new IllegalArgumentException("Ticket ID cannot be empty");
    }
  }
  
  /**
   * Marks the ticket as exited with the given exit time.
   */
  public void markExit(LocalDateTime exitTime) {
    if (!isActive) {
      throw new IllegalStateException("Ticket is already inactive");
    }
    if (exitTime.isBefore(entryTime)) {
      throw new IllegalArgumentException("Exit time cannot be before entry time");
    }
    
    this.exitTime = exitTime;
    this.isActive = false;
  }
  
  /**
   * Calculates the duration of parking.
   * If not yet exited, calculates duration up to now.
   */
  public Duration calculateDuration() {
    LocalDateTime endTime = exitTime != null ? exitTime : LocalDateTime.now();
    return Duration.between(entryTime, endTime);
  }
  
  /**
   * Checks if this ticket is valid for exit processing.
   */
  public boolean isValid() {
    return isActive && exitTime == null;
  }
  
  public String getTicketId() { return ticketId; }
  public Vehicle getVehicle() { return vehicle; }
  public ParkingSpace getParkingSpace() { return parkingSpace; }
  public LocalDateTime getEntryTime() { return entryTime; }
  public LocalDateTime getExitTime() { return exitTime; }
  public boolean isActive() { return isActive; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof ParkingTicket)) return false;
    ParkingTicket that = (ParkingTicket) o;
    return ticketId.equals(that.ticketId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(ticketId);
  }
  
  @Override
  public String toString() {
    return "ParkingTicket{" +
      "ticketId='" + ticketId + '\'' +
      ", vehicle=" + vehicle +
      ", spaceId='" + parkingSpace.getSpaceId() + '\'' +
      ", entryTime=" + entryTime +
      ", exitTime=" + exitTime +
      ", isActive=" + isActive +
      '}';
  }
}
