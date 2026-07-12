package com.you.lld.problems.hotelbooking.service;

import com.you.lld.problems.hotelbooking.model.Reservation;

/**
 * Observer pattern — subscribers are notified of reservation-lifecycle events so
 * that side effects (email/SMS confirmations, audit logs, housekeeping alerts)
 * live outside the {@code Reservation} entity and outside the core booking logic.
 *
 * <p>Java-8 {@code default} no-op methods let an implementation override only the
 * events it cares about (e.g. a confirmation mailer only overrides
 * {@link #onConfirmed}).
 */
public interface BookingObserver {

    default void onConfirmed(Reservation reservation) {
    }

    default void onCheckedIn(Reservation reservation) {
    }

    default void onCheckedOut(Reservation reservation) {
    }

    default void onCancelled(Reservation reservation) {
    }

    default void onNoShow(Reservation reservation) {
    }
}
