package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Core entity representing a ride from pickup to dropoff.
 *
 * Uses the State pattern for lifecycle transitions:
 *   Requested  --accept-->    Accepted
 *   Accepted   --start-->     InProgress
 *   InProgress --complete-->  Completed
 *   Any active --cancel-->    Cancelled
 *
 * Invalid transitions throw IllegalStateException from the state objects.
 * Thread safety: mutations happen under synchronized(this) in the service layer.
 */
public class Trip {
    private final String tripId;
    private final String riderId;
    private final Location pickup;
    private final Location dropoff;
    private final VehicleType vehicleType;
    private final LocalDateTime requestedAt;
    private final double estimatedFare;

    private TripState state;
    private String driverId;
    private LocalDateTime acceptedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private double actualFare;
    private String cancelledBy;
    private String cancellationReason;
    private double cancellationFee;

    public Trip(String tripId, String riderId, Location pickup, Location dropoff,
                VehicleType vehicleType, double estimatedFare) {
        this.tripId = tripId;
        this.riderId = riderId;
        this.pickup = pickup;
        this.dropoff = dropoff;
        this.vehicleType = vehicleType;
        this.estimatedFare = estimatedFare;
        this.requestedAt = LocalDateTime.now();
        this.state = RequestedState.INSTANCE;
    }

    // --- State-delegated operations ---

    public void accept(String driverId) {
        this.state = state.accept(this, driverId);
    }

    public void start() {
        this.state = state.start(this);
    }

    public void complete(double actualFare) {
        this.state = state.complete(this, actualFare);
    }

    public void cancel(String cancelledBy, String reason) {
        this.state = state.cancel(this, cancelledBy, reason);
    }

    // --- Queries ---

    public TripStatus getStatus() { return state.getStatus(); }

    public double getDistance() { return pickup.distanceTo(dropoff); }

    // --- Package-private setters for state objects ---

    void setDriverIdInternal(String driverId) { this.driverId = driverId; }
    void setAcceptedAtInternal(LocalDateTime t) { this.acceptedAt = t; }
    void setStartedAtInternal(LocalDateTime t) { this.startedAt = t; }
    void setCompletedAtInternal(LocalDateTime t) { this.completedAt = t; }
    void setActualFareInternal(double fare) { this.actualFare = fare; }
    void setCancelledByInternal(String id) { this.cancelledBy = id; }
    void setCancellationReasonInternal(String reason) { this.cancellationReason = reason; }

    public void setCancellationFee(double fee) { this.cancellationFee = fee; }

    // --- Public getters ---

    public String getTripId() { return tripId; }
    public String getRiderId() { return riderId; }
    public String getDriverId() { return driverId; }
    public Location getPickupLocation() { return pickup; }
    public Location getDropoffLocation() { return dropoff; }
    public VehicleType getVehicleType() { return vehicleType; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public double getEstimatedFare() { return estimatedFare; }
    public double getActualFare() { return actualFare; }
    public String getCancelledBy() { return cancelledBy; }
    public String getCancellationReason() { return cancellationReason; }
    public double getCancellationFee() { return cancellationFee; }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Trip[").append(tripId).append("] ").append(getStatus());
        sb.append(" | ").append(pickup).append(" -> ").append(dropoff);
        sb.append(" | ").append(vehicleType);
        sb.append(" | est=$").append(String.format("%.2f", estimatedFare));
        if (actualFare > 0) sb.append(", actual=$").append(String.format("%.2f", actualFare));
        if (driverId != null) sb.append(" | driver=").append(driverId);
        if (cancellationReason != null) sb.append(" | cancelled: ").append(cancellationReason);
        return sb.toString();
    }
}
