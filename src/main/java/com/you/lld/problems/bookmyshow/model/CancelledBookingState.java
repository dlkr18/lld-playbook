package com.you.lld.problems.bookmyshow.model;

public class CancelledBookingState implements BookingState {
    public static final CancelledBookingState INSTANCE = new CancelledBookingState();
    private CancelledBookingState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingState cancel(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.CANCELLED; }
}
