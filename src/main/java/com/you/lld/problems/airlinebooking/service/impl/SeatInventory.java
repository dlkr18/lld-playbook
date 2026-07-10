package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Aircraft;
import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.model.SeatClass;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Per-flight seat availability, and the heart of the concurrency design.
 *
 * <p>Each seat has its own {@link AtomicReference} to an immutable
 * {@link Occupancy} snapshot. The only way to reserve a seat is a
 * <b>compare-and-set</b> from an {@code AVAILABLE} (or lazily-expired {@code HELD})
 * snapshot to a new {@code HELD} snapshot. Because CAS is atomic, when N threads
 * race for the same seat exactly one wins; the losers observe the changed
 * reference and back off. This is lock-free — no mutex, no blocking — and
 * because references are per-seat, holds on different seats never contend.
 *
 * <p>Holds carry an expiry instant. A hold can be superseded two ways:
 * <ul>
 *   <li><b>lazily</b> — a new {@link #tryHold} attempt treats an expired hold as
 *       available and CASes over it; or</li>
 *   <li><b>eagerly</b> — {@link #sweepExpired} scans and releases expired holds so
 *       their bookings can be marked EXPIRED even if nobody re-requests the seat.</li>
 * </ul>
 */
public final class SeatInventory {

    /** Internal availability of a single seat. */
    public enum SlotStatus {
        AVAILABLE, HELD, BOOKED
    }

    /**
     * Immutable snapshot of a seat's occupancy. New snapshots are swapped in via
     * CAS; the object is never mutated in place, which is what makes the
     * compare-and-set semantics correct.
     */
    private static final class Occupancy {
        final SlotStatus status;
        final String bookingId;   // owner PNR when HELD/BOOKED, else null
        final Instant holdExpiry; // meaningful only when HELD

        private Occupancy(SlotStatus status, String bookingId, Instant holdExpiry) {
            this.status = status;
            this.bookingId = bookingId;
            this.holdExpiry = holdExpiry;
        }

        static Occupancy available() {
            return new Occupancy(SlotStatus.AVAILABLE, null, null);
        }

        static Occupancy held(String bookingId, Instant expiry) {
            return new Occupancy(SlotStatus.HELD, bookingId, expiry);
        }

        static Occupancy booked(String bookingId) {
            return new Occupancy(SlotStatus.BOOKED, bookingId, null);
        }

        boolean isExpiredHold(Instant now) {
            return status == SlotStatus.HELD && now.isAfter(holdExpiry);
        }
    }

    private final Map<String, Seat> seatsByNumber;
    private final Map<String, AtomicReference<Occupancy>> occupancy;

    public SeatInventory(Aircraft aircraft) {
        if (aircraft == null) {
            throw new IllegalArgumentException("Aircraft is required");
        }
        Map<String, Seat> seats = new HashMap<String, Seat>();
        Map<String, AtomicReference<Occupancy>> occ = new HashMap<String, AtomicReference<Occupancy>>();
        for (int i = 0; i < aircraft.seats().size(); i++) {
            Seat seat = aircraft.seats().get(i);
            seats.put(seat.number(), seat);
            occ.put(seat.number(), new AtomicReference<Occupancy>(Occupancy.available()));
        }
        this.seatsByNumber = Collections.unmodifiableMap(seats);
        this.occupancy = Collections.unmodifiableMap(occ);
    }

    public boolean hasSeat(String seatNumber) {
        return seatsByNumber.containsKey(seatNumber);
    }

    public Seat seat(String seatNumber) {
        return seatsByNumber.get(seatNumber);
    }

    /**
     * Attempts to move a seat AVAILABLE (or expired-HELD) -> HELD by
     * {@code bookingId}. Returns {@code true} iff this caller won the seat.
     *
     * <p>Lock-free CAS retry loop: retries only while the seat remains eligible
     * (available or an expired hold) but the reference kept changing under us.
     */
    public boolean tryHold(String seatNumber, String bookingId, Instant expiry) {
        AtomicReference<Occupancy> ref = require(seatNumber);
        Instant now = Instant.now();
        for (;;) {
            Occupancy current = ref.get();
            boolean eligible = current.status == SlotStatus.AVAILABLE
                    || current.isExpiredHold(now);
            if (!eligible) {
                return false; // BOOKED, or an active hold held by someone else
            }
            Occupancy next = Occupancy.held(bookingId, expiry);
            if (ref.compareAndSet(current, next)) {
                return true;
            }
            // Lost the race; re-read and re-evaluate eligibility.
        }
    }

    /**
     * Confirms a held seat into BOOKED. Succeeds only if the seat is still HELD
     * by {@code bookingId} and the hold has not expired.
     */
    public boolean confirm(String seatNumber, String bookingId) {
        AtomicReference<Occupancy> ref = require(seatNumber);
        Instant now = Instant.now();
        for (;;) {
            Occupancy current = ref.get();
            boolean ownedActiveHold = current.status == SlotStatus.HELD
                    && bookingId.equals(current.bookingId)
                    && !current.isExpiredHold(now);
            if (!ownedActiveHold) {
                return false;
            }
            if (ref.compareAndSet(current, Occupancy.booked(bookingId))) {
                return true;
            }
        }
    }

    /**
     * Releases a seat currently HELD or BOOKED by {@code bookingId} back to
     * AVAILABLE. Idempotent-safe: returns {@code false} if the seat is not owned
     * by this booking (e.g. already released or taken over after expiry).
     */
    public boolean release(String seatNumber, String bookingId) {
        AtomicReference<Occupancy> ref = require(seatNumber);
        for (;;) {
            Occupancy current = ref.get();
            boolean owned = (current.status == SlotStatus.HELD || current.status == SlotStatus.BOOKED)
                    && bookingId.equals(current.bookingId);
            if (!owned) {
                return false;
            }
            if (ref.compareAndSet(current, Occupancy.available())) {
                return true;
            }
        }
    }

    /**
     * Eagerly releases every hold whose TTL elapsed as of {@code now}, returning
     * the {@code bookingId}s that were freed so the orchestrator can transition
     * their bookings to EXPIRED.
     */
    public List<String> sweepExpired(Instant now) {
        List<String> freed = new ArrayList<String>();
        for (AtomicReference<Occupancy> ref : occupancy.values()) {
            Occupancy current = ref.get();
            if (current.isExpiredHold(now)) {
                if (ref.compareAndSet(current, Occupancy.available())) {
                    freed.add(current.bookingId);
                }
            }
        }
        return freed;
    }

    public SlotStatus statusOf(String seatNumber) {
        return require(seatNumber).get().status;
    }

    public boolean isAvailable(String seatNumber) {
        return statusOf(seatNumber) == SlotStatus.AVAILABLE;
    }

    /** Snapshot of seats currently AVAILABLE in the given class, in layout order. */
    public List<Seat> availableSeats(SeatClass seatClass) {
        List<Seat> result = new ArrayList<Seat>();
        for (Seat seat : seatsByNumber.values()) {
            if (seat.seatClass() == seatClass && isAvailable(seat.number())) {
                result.add(seat);
            }
        }
        Collections.sort(result, new SeatOrder());
        return result;
    }

    private AtomicReference<Occupancy> require(String seatNumber) {
        AtomicReference<Occupancy> ref = occupancy.get(seatNumber);
        if (ref == null) {
            throw new IllegalArgumentException("Unknown seat: " + seatNumber);
        }
        return ref;
    }

    /** Orders seats front-to-back, then left-to-right, for stable allocation. */
    private static final class SeatOrder implements java.util.Comparator<Seat> {
        @Override
        public int compare(Seat a, Seat b) {
            if (a.row() != b.row()) {
                return Integer.compare(a.row(), b.row());
            }
            return Character.compare(a.column(), b.column());
        }
    }
}
