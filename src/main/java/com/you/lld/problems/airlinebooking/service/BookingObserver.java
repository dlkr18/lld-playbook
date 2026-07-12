package com.you.lld.problems.airlinebooking.service;

import com.you.lld.problems.airlinebooking.model.Booking;

/**
 * Observer: notified of terminal-ish booking lifecycle events so notification
 * channels (email, SMS, push) can react without the orchestrator knowing about
 * any of them.
 *
 * <p>New channels are added by registering another observer — the orchestrator
 * (subject) never changes.
 */
public interface BookingObserver {

    /** Fired after a hold is successfully confirmed into a ticketed booking. */
    void onConfirmed(Booking booking);

    /** Fired after a booking is cancelled and its seat released. */
    void onCancelled(Booking booking);
}
