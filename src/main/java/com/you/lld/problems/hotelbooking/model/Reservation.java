package com.you.lld.problems.hotelbooking.model;

import java.math.BigDecimal;

/**
 * A booking of one {@link Room} by one {@link Guest} over a {@link DateRange}.
 *
 * <p>The reservation is the unit that blocks a room's availability. Its lifecycle
 * is driven by the {@link ReservationState} it delegates to — the entity holds
 * the current state reference but contains no transition rules itself.
 *
 * <p><b>Thread-safety:</b> the mutable field here is {@link #state}. State changes
 * are only ever invoked by the orchestrator while holding the owning room's lock
 * (the same lock guarding availability checks), so a reservation's status never
 * changes concurrently with an availability decision that depends on it.
 */
public final class Reservation {

    private final String id;
    private final Room room;
    private final Guest guest;
    private final DateRange stay;
    private final BigDecimal totalPrice;

    private ReservationState state;

    public Reservation(String id, Room room, Guest guest, DateRange stay, BigDecimal totalPrice) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("reservation id required");
        }
        if (room == null || guest == null || stay == null) {
            throw new IllegalArgumentException("room, guest and stay are required");
        }
        if (totalPrice == null || totalPrice.signum() < 0) {
            throw new IllegalArgumentException("totalPrice must be non-negative");
        }
        this.id = id;
        this.room = room;
        this.guest = guest;
        this.stay = stay;
        this.totalPrice = totalPrice;
        this.state = ReservedState.INSTANCE;
    }

    public String id() {
        return id;
    }

    public Room room() {
        return room;
    }

    public Guest guest() {
        return guest;
    }

    public DateRange stay() {
        return stay;
    }

    public BigDecimal totalPrice() {
        return totalPrice;
    }

    public ReservationStatus status() {
        return state.status();
    }

    /** Package-private: only {@link ReservationState} implementations flip the state. */
    void setState(ReservationState newState) {
        this.state = newState;
    }

    // ---- lifecycle actions delegate to the current state --------------------

    public void checkIn() {
        state.checkIn(this);
    }

    public void checkOut() {
        state.checkOut(this);
    }

    public void cancel() {
        state.cancel(this);
    }

    public void markNoShow() {
        state.markNoShow(this);
    }

    /**
     * Whether this reservation currently reserves the room for its dates. Only
     * {@code RESERVED} and {@code CHECKED_IN} block; cancelled / no-show /
     * checked-out reservations release the dates for re-booking.
     */
    public boolean blocksAvailability() {
        ReservationStatus s = status();
        return s == ReservationStatus.RESERVED || s == ReservationStatus.CHECKED_IN;
    }

    @Override
    public String toString() {
        return "Reservation{" + id + ", " + room.id() + ", " + guest.name()
                + ", " + stay + ", " + status() + ", $" + totalPrice + "}";
    }
}
