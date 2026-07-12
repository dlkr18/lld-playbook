package com.you.lld.problems.carrental.service;

import com.you.lld.problems.carrental.model.Reservation;

/**
 * Observer notified of reservation lifecycle events (Observer pattern). Lets the
 * system fire confirmations / reminders / receipts without the orchestrator
 * knowing about email, SMS, push, analytics, etc.
 *
 * <p>Default methods keep observers that only care about one event terse.
 * Implementations should be fast and must not throw — the orchestrator invokes
 * them while it may hold locks; slow work belongs on a queue.
 */
public interface ReservationObserver {

    /** Fired when a reservation is confirmed. */
    default void onReserved(Reservation reservation) {
    }

    /** Fired when the customer picks the car up (rental starts). */
    default void onPickedUp(Reservation reservation) {
    }

    /** Fired when the car is returned (rental ends, charges finalized). */
    default void onReturned(Reservation reservation) {
    }

    /** Fired when a reservation is cancelled. */
    default void onCancelled(Reservation reservation) {
    }
}
