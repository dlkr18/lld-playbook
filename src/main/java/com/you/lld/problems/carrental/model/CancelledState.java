package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Terminal state: the reservation was cancelled before pickup and no longer
 * holds the car. No further transitions are permitted.
 */
public final class CancelledState implements ReservationState {

    public static final CancelledState INSTANCE = new CancelledState();

    private CancelledState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.CANCELLED;
    }

    @Override
    public void pickUp(Reservation reservation, LocalDateTime at) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is cancelled");
    }

    @Override
    public Charges returnCar(Reservation reservation, LocalDateTime at, BigDecimal lateFee) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is cancelled");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is already cancelled");
    }
}
