package com.you.lld.problems.airlinebooking.model;

/**
 * Initial state after a seat is held. A hold may be confirmed, cancelled, or
 * expired. Singleton — access via {@link #INSTANCE}.
 */
public final class HeldState implements BookingState {

    public static final HeldState INSTANCE = new HeldState();

    private HeldState() {
    }

    @Override
    public void confirm(Booking booking) {
        booking.setState(ConfirmedState.INSTANCE);
    }

    @Override
    public void cancel(Booking booking) {
        booking.setState(CancelledState.INSTANCE);
    }

    @Override
    public void expire(Booking booking) {
        booking.setState(ExpiredState.INSTANCE);
    }

    @Override
    public BookingStatus status() {
        return BookingStatus.HELD;
    }
}
