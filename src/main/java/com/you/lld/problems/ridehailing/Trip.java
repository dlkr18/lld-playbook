package com.you.lld.problems.ridehailing;
import java.time.LocalDateTime;

public class Trip {
    public enum TripStatus { REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED }
    
    private final String tripId;
    private final String riderId;
    private String driverId;
    private String pickupLocation;
    private String dropLocation;
    private TripStatus status;
    private LocalDateTime requestTime;
    
    public Trip(String tripId, String riderId, String pickup, String drop) {
        this.tripId = tripId;
        this.riderId = riderId;
        this.pickupLocation = pickup;
        this.dropLocation = drop;
        this.status = TripStatus.REQUESTED;
        this.requestTime = LocalDateTime.now();
    }
    
    public String getTripId() { return tripId; }
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    public void assignDriver(String driverId) { this.driverId = driverId; }
}
