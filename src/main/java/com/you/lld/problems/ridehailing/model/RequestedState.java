package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Ride has been requested by a rider, waiting for a driver to accept.
 * Valid transitions: accept -> Accepted, cancel -> Cancelled.
 */
public class RequestedState implements TripState {

    public static final RequestedState INSTANCE = new RequestedState();
    private RequestedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        trip.setDriverIdInternal(driverId);
        trip.setAcceptedAtInternal(LocalDateTime.now());
        return AcceptedState.INSTANCE;
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " must be accepted before starting");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " must be started before completing");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        trip.setCancelledByInternal(cancelledBy);
        trip.setCancellationReasonInternal(reason);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CancelledState.INSTANCE;
    }

    @Override
    public TripStatus getStatus() { return TripStatus.REQUESTED; }

    @Override
    public String toString() { return "REQUESTED"; }
}
