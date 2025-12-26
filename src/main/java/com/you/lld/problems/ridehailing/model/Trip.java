package com.you.lld.problems.ridehailing.model;

import java.time.*;

public class Trip {
    private String tripId;
    private String riderId;
    private String driverId;
    private Location pickup;
    private Location dropoff;
    private TripStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double fare;
    
    public Trip(String id, String riderId, String driverId) {
        this.tripId = id;
        this.riderId = riderId;
        this.driverId = driverId;
        this.status = TripStatus.REQUESTED;
    }
    
    public String getTripId() {
        return tripId;
    }
    
    public String getRiderId() {
        return riderId;
    }
    
    public String getDriverId() {
        return driverId;
    }
    
    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }
    
    public Location getPickupLocation() {
        return pickup;
    }
    
    public void setPickupLocation(Location pickup) {
        this.pickup = pickup;
    }
    
    public Location getDropoffLocation() {
        return dropoff;
    }
    
    public void setDropoffLocation(Location dropoff) {
        this.dropoff = dropoff;
    }
    
    public TripStatus getStatus() {
        return status;
    }
    
    public void setStatus(TripStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public double getFare() {
        return fare;
    }
    
    public void setFare(double fare) {
        this.fare = fare;
    }
}
