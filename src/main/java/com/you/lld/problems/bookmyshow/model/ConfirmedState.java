package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class ConfirmedState implements BookingState {
    public static final ConfirmedState INSTANCE = new ConfirmedState();
    private ConfirmedState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already confirmed");
    }

    @Override
    public BookingState cancel(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return CancelledBookingState.INSTANCE;
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Cannot expire a confirmed booking");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.CONFIRMED; }
}
