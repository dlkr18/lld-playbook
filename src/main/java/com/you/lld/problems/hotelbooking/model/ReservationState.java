package com.you.lld.problems.hotelbooking.model;

/**
 * State pattern — one implementation per {@link ReservationStatus}. Each state
 * knows which lifecycle actions are legal from it: legal actions transition the
 * {@link Reservation} to the next state; illegal actions throw
 * {@link IllegalStateException}. This removes the "big switch on status" from the
 * entity and makes each transition rule live in exactly one place.
 *
 * <p>Implementations are stateless singletons (see {@code *State.INSTANCE}), so
 * they are trivially shareable across all reservations and threads.
 */
public interface ReservationState {

    ReservationStatus status();

    void checkIn(Reservation reservation);

    void checkOut(Reservation reservation);

    void cancel(Reservation reservation);

    void markNoShow(Reservation reservation);
}
