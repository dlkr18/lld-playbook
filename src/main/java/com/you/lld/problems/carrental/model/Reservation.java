package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * A booking of one {@link Car} by one {@link Customer} for a {@link DateRange}.
 *
 * <p>This is the mutable heart of the domain. It holds a {@link ReservationState}
 * (State pattern) and delegates the {@code pickUp / returnCar / cancel} verbs to
 * it; the state decides which transitions are legal. The lifecycle mutators
 * ({@link #markPickedUp}, {@link #markReturned}, {@link #setState}) are
 * package-private so only the state objects — which live in this package — can
 * drive them, keeping the state machine encapsulated.
 *
 * <p>Thread-safety: the transition verbs are {@code synchronized} on the
 * reservation, so a single reservation can never be half-transitioned by two
 * threads. (The orchestrator additionally serializes transitions for a given car
 * under that car's lock.)
 */
public final class Reservation {
    private final String id;
    private final Car car;
    private final Customer customer;
    private final DateRange period;
    private final BigDecimal baseCost;          // quoted & frozen at reservation time
    private final LocalDateTime scheduledDropoff;

    private ReservationState state;
    private LocalDateTime pickedUpAt;   // null until picked up
    private LocalDateTime returnedAt;   // null until returned
    private Charges charges;            // null until returned

    public Reservation(String id, Car car, Customer customer, DateRange period, BigDecimal baseCost) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Reservation id required");
        }
        if (car == null || customer == null || period == null) {
            throw new IllegalArgumentException("car, customer and period required");
        }
        if (baseCost == null || baseCost.signum() < 0) {
            throw new IllegalArgumentException("baseCost must be non-negative");
        }
        this.id = id;
        this.car = car;
        this.customer = customer;
        this.period = period;
        this.baseCost = baseCost;
        // Drop-off day is exclusive; the car is due back at the start of that day.
        this.scheduledDropoff = period.getDropoff().atStartOfDay();
        this.state = ReservedState.INSTANCE;
    }

    // ---- lifecycle verbs (delegate to the current state) ----

    public synchronized void pickUp(LocalDateTime at) {
        requireTime(at);
        state.pickUp(this, at);
    }

    /** @param lateFee fee pre-computed by the orchestrator's LateFeePolicy (0 if on time). */
    public synchronized Charges returnCar(LocalDateTime at, BigDecimal lateFee) {
        requireTime(at);
        if (lateFee == null || lateFee.signum() < 0) {
            throw new IllegalArgumentException("lateFee must be non-negative");
        }
        return state.returnCar(this, at, lateFee);
    }

    public synchronized void cancel() {
        state.cancel(this);
    }

    // ---- state-driven mutators (package-private on purpose) ----

    void setState(ReservationState state) {
        this.state = state;
    }

    void markPickedUp(LocalDateTime at) {
        this.pickedUpAt = at;
    }

    void markReturned(LocalDateTime at, Charges charges) {
        this.returnedAt = at;
        this.charges = charges;
    }

    // ---- queries ----

    public ReservationStatus getStatus() {
        return state.status();
    }

    /** Active reservations (RESERVED or PICKED_UP) hold the car and block overlaps. */
    public boolean isActive() {
        ReservationStatus s = getStatus();
        return s == ReservationStatus.RESERVED || s == ReservationStatus.PICKED_UP;
    }

    public String getId() {
        return id;
    }

    public Car getCar() {
        return car;
    }

    public Customer getCustomer() {
        return customer;
    }

    public DateRange getPeriod() {
        return period;
    }

    public BigDecimal getBaseCost() {
        return baseCost;
    }

    public LocalDateTime getScheduledDropoff() {
        return scheduledDropoff;
    }

    public synchronized LocalDateTime getPickedUpAt() {
        return pickedUpAt;
    }

    public synchronized LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    /** The finalized charges, or {@code null} until the car is returned. */
    public synchronized Charges getCharges() {
        return charges;
    }

    private static void requireTime(LocalDateTime at) {
        if (at == null) {
            throw new IllegalArgumentException("timestamp required");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Reservation{" + id + ", " + car + ", " + customer.getName()
                + ", " + period + ", " + getStatus() + "}";
    }
}
