package com.you.lld.problems.airlinebooking.model;

/**
 * Terminal state: the booking was cancelled and its seat released. All further
 * lifecycle transitions are rejected.
 */
public final class CancelledState implements BookingState {

    public static final CancelledState INSTANCE = new CancelledState();

    private CancelledState() {
    }

    @Override
    public void confirm(Booking booking) {
        throw new IllegalStateException("Cancelled booking " + booking.pnr() + " cannot be confirmed");
    }

    @Override
    public void cancel(Booking booking) {
        throw new IllegalStateException("Booking " + booking.pnr() + " is already cancelled");
    }

    @Override
    public void expire(Booking booking) {
        throw new IllegalStateException("Cancelled booking " + booking.pnr() + " cannot expire");
    }

    @Override
    public BookingStatus status() {
        return BookingStatus.CANCELLED;
    }
}
