package com.you.lld.problems.carrental.model;

/**
 * Lifecycle status of a reservation. Mirrors the concrete {@code ReservationState}
 * objects (State pattern); exposed as a plain enum so callers, tests and the demo
 * can assert on the current phase without depending on the state classes.
 *
 * <pre>
 *   RESERVED --pickUp--> PICKED_UP --returnCar--> RETURNED
 *        \--cancel--> CANCELLED
 * </pre>
 */
public enum ReservationStatus {
    RESERVED,
    PICKED_UP,
    RETURNED,
    CANCELLED
}
