package com.you.lld.problems.ridehailing.model;

/**
 * Terminal state -- trip was cancelled by rider or driver.
 * No further transitions allowed.
 */
public class CancelledState implements TripState {

    public static final CancelledState INSTANCE = new CancelledState();
    private CancelledState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripStatus getStatus() { return TripStatus.CANCELLED; }

    @Override
    public String toString() { return "CANCELLED"; }
}
