package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class PendingState implements BookingState {
    public static final PendingState INSTANCE = new PendingState();
    private PendingState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Cannot confirm booking -- payment status is " + payment.getStatus());
        }
        booking.setPaymentInternal(payment);
        booking.setConfirmedAtInternal(LocalDateTime.now());
        return ConfirmedState.INSTANCE;
    }

    @Override
    public BookingState cancel(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return CancelledBookingState.INSTANCE;
    }

    @Override
    public BookingState expire(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return ExpiredState.INSTANCE;
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.PENDING; }
}
