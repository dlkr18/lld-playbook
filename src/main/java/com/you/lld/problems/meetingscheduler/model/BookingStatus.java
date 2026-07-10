package com.you.lld.problems.meetingscheduler.model;

/**
 * Lifecycle state of a {@link Booking}.
 *
 * <pre>
 *   CONFIRMED ---- cancel() ----> CANCELLED
 * </pre>
 *
 * A booking is born CONFIRMED (creation and slot reservation are atomic) and
 * moves to CANCELLED exactly once. CANCELLED is terminal.
 */
public enum BookingStatus {
    CONFIRMED,
    CANCELLED
}
