package com.you.lld.problems.bookmyshow.model;

public class ExpiredState implements BookingState {
    public static final ExpiredState INSTANCE = new ExpiredState();
    private ExpiredState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " has expired -- seats released");
    }

    @Override
    public BookingState cancel(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " has already expired");
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " has already expired");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.EXPIRED; }
}
