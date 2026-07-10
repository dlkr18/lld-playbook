package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Terminal state: the rental is complete and charges are finalized. No further
 * transitions are permitted.
 */
public final class ReturnedState implements ReservationState {

    public static final ReturnedState INSTANCE = new ReturnedState();

    private ReturnedState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.RETURNED;
    }

    @Override
    public void pickUp(Reservation reservation, LocalDateTime at) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is already returned");
    }

    @Override
    public Charges returnCar(Reservation reservation, LocalDateTime at, BigDecimal lateFee) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is already returned");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("Reservation " + reservation.getId() + " is already returned");
    }
}
