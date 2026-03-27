package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * A driver has accepted the ride and is heading to pickup.
 * Valid transitions: start -> InProgress, cancel -> Cancelled.
 */
public class AcceptedState implements TripState {

    public static final AcceptedState INSTANCE = new AcceptedState();
    private AcceptedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already accepted by driver " + trip.getDriverId());
    }

    @Override
    public TripState start(Trip trip) {
        trip.setStartedAtInternal(LocalDateTime.now());
        return InProgressState.INSTANCE;
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
    public TripStatus getStatus() { return TripStatus.ACCEPTED; }

    @Override
    public String toString() { return "ACCEPTED"; }
}
