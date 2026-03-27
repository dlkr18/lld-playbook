package com.you.lld.problems.ridehailing.model;

/**
 * State pattern for Trip lifecycle.
 *
 *   Requested  --accept-->    Accepted
 *   Accepted   --start-->     InProgress
 *   InProgress --complete-->  Completed
 *   Requested/Accepted/InProgress --cancel-->  Cancelled
 *
 * Invalid transitions throw IllegalStateException.
 * Implementations are stateless singletons -- all mutable data lives on Trip.
 */
public interface TripState {

    TripState accept(Trip trip, String driverId);

    TripState start(Trip trip);

    TripState complete(Trip trip, double actualFare);

    TripState cancel(Trip trip, String cancelledBy, String reason);

    TripStatus getStatus();
}
