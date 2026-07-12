package com.you.lld.problems.hotelbooking.service.impl;

import com.you.lld.problems.hotelbooking.model.Reservation;
import com.you.lld.problems.hotelbooking.service.BookingObserver;

/**
 * A concrete {@link BookingObserver} that prints human-readable notifications to
 * stdout — stands in for an email/SMS gateway. Keeping this out of the entity and
 * the orchestrator means notification channels can be added or removed by
 * (un)subscribing, with no change to booking logic.
 */
public final class ConsoleNotificationObserver implements BookingObserver {

    private final String channel;

    public ConsoleNotificationObserver(String channel) {
        this.channel = (channel == null || channel.trim().isEmpty()) ? "NOTIFY" : channel;
    }

    @Override
    public void onConfirmed(Reservation r) {
        emit("Booking CONFIRMED for " + r.guest().name() + " — room " + r.room().id()
                + " " + r.stay() + " total $" + r.totalPrice());
    }

    @Override
    public void onCheckedIn(Reservation r) {
        emit("Checked IN: " + r.guest().name() + " room " + r.room().id());
    }

    @Override
    public void onCheckedOut(Reservation r) {
        emit("Checked OUT: " + r.guest().name() + " room " + r.room().id());
    }

    @Override
    public void onCancelled(Reservation r) {
        emit("Booking CANCELLED: " + r.guest().name() + " room " + r.room().id() + " " + r.stay());
    }

    @Override
    public void onNoShow(Reservation r) {
        emit("NO-SHOW recorded: " + r.guest().name() + " room " + r.room().id());
    }

    private void emit(String message) {
        System.out.println("    [" + channel + "] " + message);
    }
}
