package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Booking;
import com.you.lld.problems.airlinebooking.service.BookingObserver;

/**
 * Observer that "emails" the passenger on confirmation and cancellation. In a
 * real system this would call an email gateway; here it prints so the demo and
 * tests can observe the effect.
 */
public final class EmailBookingObserver implements BookingObserver {

    @Override
    public void onConfirmed(Booking booking) {
        System.out.println("[EMAIL] To " + booking.passenger().email()
                + ": Ticket confirmed. PNR " + booking.pnr()
                + ", flight " + booking.flight().flightNumber()
                + ", seat " + booking.seat().number()
                + ", fare " + booking.fare());
    }

    @Override
    public void onCancelled(Booking booking) {
        System.out.println("[EMAIL] To " + booking.passenger().email()
                + ": Booking " + booking.pnr() + " cancelled. Seat "
                + booking.seat().number() + " released.");
    }
}
