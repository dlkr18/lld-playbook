package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Booking;
import com.you.lld.problems.airlinebooking.service.BookingObserver;

/**
 * Observer that "texts" the passenger on confirmation. Registering it alongside
 * {@link EmailBookingObserver} shows multi-channel notification with zero
 * changes to the orchestrator (the subject).
 */
public final class SmsBookingObserver implements BookingObserver {

    @Override
    public void onConfirmed(Booking booking) {
        System.out.println("[SMS] " + booking.passenger().name()
                + ", your seat " + booking.seat().number()
                + " on " + booking.flight().flightNumber()
                + " is confirmed (PNR " + booking.pnr() + ").");
    }

    @Override
    public void onCancelled(Booking booking) {
        System.out.println("[SMS] " + booking.passenger().name()
                + ", booking " + booking.pnr() + " has been cancelled.");
    }
}
