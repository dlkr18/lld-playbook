package com.you.lld.problems.airlinebooking.model;

import java.util.Objects;

/**
 * Immutable physical position in an aircraft's seat map.
 *
 * <p>A seat only describes <em>where</em> it is and <em>which cabin</em> it
 * belongs to. It carries no mutable availability state — that lives in the
 * concurrency layer ({@code SeatInventory}) so the same {@code Seat} object can
 * be shared freely across threads and flights of the same aircraft type.
 *
 * <p>The {@code number} (e.g. {@code "12A"}) is unique within an aircraft and is
 * the sole basis for equality.
 */
public final class Seat {

    private final String number;
    private final int row;
    private final char column;
    private final SeatClass seatClass;

    public Seat(int row, char column, SeatClass seatClass) {
        if (row <= 0) {
            throw new IllegalArgumentException("Row must be positive");
        }
        if (seatClass == null) {
            throw new IllegalArgumentException("Seat class is required");
        }
        this.row = row;
        this.column = Character.toUpperCase(column);
        this.seatClass = seatClass;
        this.number = row + "" + this.column;
    }

    public String number() {
        return number;
    }

    public int row() {
        return row;
    }

    public char column() {
        return column;
    }

    public SeatClass seatClass() {
        return seatClass;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Seat seat = (Seat) o;
        return number.equals(seat.number);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(number);
    }

    @Override
    public String toString() {
        return number + "(" + seatClass + ")";
    }
}
