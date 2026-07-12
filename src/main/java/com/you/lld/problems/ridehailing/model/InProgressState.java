package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Rider has been picked up and the trip is underway.
 * Valid transitions: complete -> Completed, cancel -> Cancelled (emergency).
 */
public class InProgressState implements TripState {

    public static final InProgressState INSTANCE = new InProgressState();
    private InProgressState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already in progress");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already in progress");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        trip.setActualFareInternal(actualFare);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CompletedState.INSTANCE;
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        trip.setCancelledByInternal(cancelledBy);
        trip.setCancellationReasonInternal(reason);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CancelledState.INSTANCE;
    }

    @Override
    public TripStatus getStatus() { return TripStatus.IN_PROGRESS; }

    @Override
    public String toString() { return "IN_PROGRESS"; }
}
