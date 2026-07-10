package com.you.lld.problems.airlinebooking.model;

/**
 * A ticketed booking. It can still be cancelled (releasing the seat) but cannot
 * be confirmed again or expire (a confirmed seat is no longer on a TTL).
 */
public final class ConfirmedState implements BookingState {

    public static final ConfirmedState INSTANCE = new ConfirmedState();

    private ConfirmedState() {
    }

    @Override
    public void confirm(Booking booking) {
        throw new IllegalStateException("Booking " + booking.pnr() + " is already confirmed");
    }

    @Override
    public void cancel(Booking booking) {
        booking.setState(CancelledState.INSTANCE);
    }

    @Override
    public void expire(Booking booking) {
        throw new IllegalStateException("Confirmed booking " + booking.pnr() + " cannot expire");
    }

    @Override
    public BookingStatus status() {
        return BookingStatus.CONFIRMED;
    }
}
