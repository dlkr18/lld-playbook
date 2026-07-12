package com.you.lld.problems.hotelbooking.model;

/**
 * The lifecycle status of a {@link Reservation}. The legal transitions between
 * these values are enforced by the State pattern (see {@link ReservationState}
 * and its implementations), not by scattered {@code if} checks.
 *
 * <pre>
 *   RESERVED --checkIn--> CHECKED_IN --checkOut--> CHECKED_OUT
 *      |  \--cancel--> CANCELLED
 *      \--markNoShow--> NO_SHOW
 * </pre>
 */
public enum ReservationStatus {
    RESERVED,
    CHECKED_IN,
    CHECKED_OUT,
    CANCELLED,
    NO_SHOW
}
