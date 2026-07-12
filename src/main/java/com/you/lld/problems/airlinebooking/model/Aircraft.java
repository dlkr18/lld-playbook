package com.you.lld.problems.airlinebooking.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Immutable aircraft type with a concrete seat map.
 *
 * <p>The seat map is the distinguishing model of this problem: seats are laid
 * out as {@code rows x columns}, grouped into cabins by {@link SeatClass}. The
 * {@link Builder} generates sequentially-numbered rows so the caller only
 * declares "N rows of M seats" per cabin.
 *
 * <p>Cabins are stacked in the order they are added (FIRST at the nose, then
 * BUSINESS, then ECONOMY, following real boarding layouts), and rows are
 * numbered continuously across cabins.
 */
public final class Aircraft {

    private final String model;
    private final List<Seat> seats;

    private Aircraft(String model, List<Seat> seats) {
        this.model = model;
        this.seats = Collections.unmodifiableList(new ArrayList<Seat>(seats));
    }

    public String model() {
        return model;
    }

    /** All seats, in layout order. Unmodifiable. */
    public List<Seat> seats() {
        return seats;
    }

    public int capacity() {
        return seats.size();
    }

    public static Builder builder(String model) {
        return new Builder(model);
    }

    /**
     * Builds a seat map cabin-by-cabin. Rows are numbered continuously so no two
     * seats in the aircraft share a seat number.
     */
    public static final class Builder {
        private final String model;
        private final List<Seat> seats = new ArrayList<Seat>();
        private int nextRow = 1;

        private Builder(String model) {
            if (model == null || model.trim().isEmpty()) {
                throw new IllegalArgumentException("Aircraft model is required");
            }
            this.model = model.trim();
        }

        /**
         * Adds a cabin of {@code rows} rows and {@code seatsPerRow} seats each
         * (columns lettered A, B, C, ...).
         */
        public Builder addCabin(SeatClass seatClass, int rows, int seatsPerRow) {
            if (seatClass == null) {
                throw new IllegalArgumentException("Seat class is required");
            }
            if (rows <= 0 || seatsPerRow <= 0) {
                throw new IllegalArgumentException("Rows and seatsPerRow must be positive");
            }
            if (seatsPerRow > 26) {
                throw new IllegalArgumentException("At most 26 seats per row (A-Z)");
            }
            for (int r = 0; r < rows; r++) {
                int rowNumber = nextRow++;
                for (int c = 0; c < seatsPerRow; c++) {
                    char column = (char) ('A' + c);
                    seats.add(new Seat(rowNumber, column, seatClass));
                }
            }
            return this;
        }

        public Aircraft build() {
            if (seats.isEmpty()) {
                throw new IllegalStateException("Aircraft must have at least one cabin");
            }
            return new Aircraft(model, seats);
        }
    }
}
