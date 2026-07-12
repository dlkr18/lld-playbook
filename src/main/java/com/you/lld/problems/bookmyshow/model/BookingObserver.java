package com.you.lld.problems.bookmyshow.model;

/**
 * Observer for Booking lifecycle events.
 * Implementations (e.g. BookingNotifier) handle notification formatting/delivery.
 * Keeps Booking entity pure -- SRP.
 */
public interface BookingObserver {
    void update(Booking booking);
}
