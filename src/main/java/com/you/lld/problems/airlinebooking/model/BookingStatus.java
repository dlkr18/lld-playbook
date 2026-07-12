package com.you.lld.problems.airlinebooking.model;

/**
 * Lifecycle states of a booking / PNR.
 *
 * <pre>
 *   HELD ---confirm--> CONFIRMED
 *   HELD ---cancel---> CANCELLED
 *   HELD ---expire---> EXPIRED
 *   CONFIRMED ---cancel--> CANCELLED
 * </pre>
 *
 * CANCELLED and EXPIRED are terminal. The transition rules themselves are
 * enforced by the {@code BookingState} implementations (State pattern).
 */
public enum BookingStatus {
    HELD,
    CONFIRMED,
    CANCELLED,
    EXPIRED
}
