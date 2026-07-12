package com.you.lld.problems.ridehailing.model;

/**
 * Terminal state -- trip finished successfully.
 * No further transitions allowed.
 */
public class CompletedState implements TripState {

    public static final CompletedState INSTANCE = new CompletedState();
    private CompletedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripStatus getStatus() { return TripStatus.COMPLETED; }

    @Override
    public String toString() { return "COMPLETED"; }
}
