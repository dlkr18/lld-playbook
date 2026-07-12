package com.you.lld.problems.hotelbooking;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Guest;
import com.you.lld.problems.hotelbooking.model.Hotel;
import com.you.lld.problems.hotelbooking.model.Reservation;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.model.RoomType;
import com.you.lld.problems.hotelbooking.service.BookingObserver;
import com.you.lld.problems.hotelbooking.service.PricingStrategy;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Root orchestrator / facade for the hotel-booking domain. An interviewer sees
 * this class first: it wires together hotels, rooms, reservations, the pluggable
 * {@link PricingStrategy}, and {@link BookingObserver}s.
 *
 * <h2>Concurrency model (stated explicitly)</h2>
 * <ul>
 *   <li><b>Per-room lock.</b> Each room has its own {@link ReentrantLock}. Every
 *       operation that can change a room's availability — reserve, check-in,
 *       check-out, cancel, no-show — takes only that room's lock. Different rooms
 *       never contend, so throughput scales with the number of rooms.</li>
 *   <li><b>Atomic check-then-reserve.</b> The overlap check and the insert of the
 *       new reservation happen inside the same locked section, so two threads can
 *       never both pass the "is it free?" check for the same room + overlapping
 *       dates. Exactly one wins; the other sees the just-added reservation and is
 *       rejected.</li>
 *   <li><b>Lock-free reads for pricing.</b> Per-room reservation lists are
 *       {@link CopyOnWriteArrayList}, so occupancy sampling (advisory input to
 *       dynamic pricing) can iterate without acquiring any lock and without risk
 *       of deadlock against a held room lock.</li>
 *   <li><b>No lock held across notifications.</b> Observers are invoked after the
 *       lock is released, so slow notification channels cannot stall bookings.</li>
 * </ul>
 * A single global lock would serialize the whole hotel; a per-date lock would be
 * finer but far more complex — per-room is the sweet spot for this domain.
 */
public final class HotelBooking {

    private final Map<String, Hotel> hotels = new ConcurrentHashMap<String, Hotel>();
    private final Map<String, Room> roomsById = new ConcurrentHashMap<String, Room>();
    private final Map<String, Reservation> reservationsById = new ConcurrentHashMap<String, Reservation>();

    /** roomId -> reservations against that room. Reads are lock-free; writes hold the room lock. */
    private final Map<String, CopyOnWriteArrayList<Reservation>> reservationsByRoom =
            new ConcurrentHashMap<String, CopyOnWriteArrayList<Reservation>>();

    /** roomId -> the lock guarding availability decisions for that room. */
    private final Map<String, ReentrantLock> roomLocks = new ConcurrentHashMap<String, ReentrantLock>();

    private final List<BookingObserver> observers = new CopyOnWriteArrayList<BookingObserver>();
    private final AtomicLong reservationSeq = new AtomicLong();

    private volatile PricingStrategy pricingStrategy;

    public HotelBooking(PricingStrategy pricingStrategy) {
        if (pricingStrategy == null) {
            throw new IllegalArgumentException("pricingStrategy required");
        }
        this.pricingStrategy = pricingStrategy;
    }

    // ---- setup --------------------------------------------------------------

    public void addHotel(Hotel hotel) {
        if (hotel == null) {
            throw new IllegalArgumentException("hotel required");
        }
        hotels.put(hotel.id(), hotel);
        for (Room room : hotel.rooms()) {
            roomsById.put(room.id(), room);
            reservationsByRoom.put(room.id(), new CopyOnWriteArrayList<Reservation>());
            roomLocks.put(room.id(), new ReentrantLock());
        }
    }

    public void setPricingStrategy(PricingStrategy strategy) {
        if (strategy == null) {
            throw new IllegalArgumentException("pricingStrategy required");
        }
        this.pricingStrategy = strategy;
    }

    public void addObserver(BookingObserver observer) {
        if (observer != null) {
            observers.add(observer);
        }
    }

    public void removeObserver(BookingObserver observer) {
        observers.remove(observer);
    }

    // ---- queries ------------------------------------------------------------

    public Reservation getReservation(String reservationId) {
        return reservationsById.get(reservationId);
    }

    /**
     * All rooms in the hotel of the given type, with enough capacity, that have
     * NO blocking reservation overlapping {@code stay}.
     */
    public List<Room> searchAvailable(String hotelId, RoomType type, DateRange stay, int minCapacity) {
        Hotel hotel = requireHotel(hotelId);
        List<Room> available = new ArrayList<Room>();
        for (Room room : hotel.roomsOfType(type)) {
            if (room.capacity() < minCapacity) {
                continue;
            }
            ReentrantLock lock = roomLocks.get(room.id());
            lock.lock();
            try {
                if (!hasOverlap(room.id(), stay)) {
                    available.add(room);
                }
            } finally {
                lock.unlock();
            }
        }
        return available;
    }

    // ---- reservation ---------------------------------------------------------

    /**
     * Reserve a specific room for {@code stay}. Atomic check-then-reserve under
     * the room lock.
     *
     * @throws RoomNotAvailableException if the room already has an overlapping
     *                                   blocking reservation.
     */
    public Reservation reserve(String roomId, Guest guest, DateRange stay) {
        Room room = requireRoom(roomId);
        Reservation reservation = attemptReserve(room, guest, stay);
        if (reservation == null) {
            throw new RoomNotAvailableException(
                    "room " + roomId + " is not available for " + stay);
        }
        notifyConfirmed(reservation);
        return reservation;
    }

    /**
     * Reserve any available room of {@code type} (with enough capacity) for the
     * dates. Tries candidates in order, each with an atomic per-room attempt, and
     * returns the first success.
     *
     * @throws RoomNotAvailableException if no room of the type is free.
     */
    public Reservation reserveAny(String hotelId, RoomType type, Guest guest,
                                  DateRange stay, int minCapacity) {
        Hotel hotel = requireHotel(hotelId);
        for (Room room : hotel.roomsOfType(type)) {
            if (room.capacity() < minCapacity) {
                continue;
            }
            Reservation reservation = attemptReserve(room, guest, stay);
            if (reservation != null) {
                notifyConfirmed(reservation);
                return reservation;
            }
        }
        throw new RoomNotAvailableException(
                "no " + type + " room available for " + stay + " in hotel " + hotelId);
    }

    /**
     * The atomic core: acquire the room lock, re-check overlap, and only then add
     * the reservation. Returns {@code null} (no exception) if the room is taken,
     * so {@link #reserveAny} can cheaply try the next candidate.
     */
    private Reservation attemptReserve(Room room, Guest guest, DateRange stay) {
        // Occupancy is advisory pricing input — sample it lock-free BEFORE taking
        // the room lock to avoid any lock-ordering hazard.
        double occupancyRatio = occupancyRatioFor(room.hotelId(), room.type(), stay);
        BigDecimal total = pricingStrategy.totalFor(room, stay, occupancyRatio);

        ReentrantLock lock = roomLocks.get(room.id());
        lock.lock();
        try {
            if (hasOverlap(room.id(), stay)) {
                return null;
            }
            Reservation reservation = new Reservation(
                    "R" + reservationSeq.incrementAndGet(), room, guest, stay, total);
            reservationsByRoom.get(room.id()).add(reservation);
            reservationsById.put(reservation.id(), reservation);
            return reservation;
        } finally {
            lock.unlock();
        }
    }

    // ---- lifecycle -----------------------------------------------------------

    public void checkIn(String reservationId) {
        Reservation r = requireReservation(reservationId);
        withRoomLock(r, new Runnable() {
            public void run() {
                r.checkIn();
            }
        });
        for (BookingObserver o : observers) {
            o.onCheckedIn(r);
        }
    }

    public void checkOut(String reservationId) {
        Reservation r = requireReservation(reservationId);
        withRoomLock(r, new Runnable() {
            public void run() {
                r.checkOut();
            }
        });
        for (BookingObserver o : observers) {
            o.onCheckedOut(r);
        }
    }

    public void cancel(String reservationId) {
        Reservation r = requireReservation(reservationId);
        withRoomLock(r, new Runnable() {
            public void run() {
                r.cancel();
            }
        });
        for (BookingObserver o : observers) {
            o.onCancelled(r);
        }
    }

    public void markNoShow(String reservationId) {
        Reservation r = requireReservation(reservationId);
        withRoomLock(r, new Runnable() {
            public void run() {
                r.markNoShow();
            }
        });
        for (BookingObserver o : observers) {
            o.onNoShow(r);
        }
    }

    // ---- helpers -------------------------------------------------------------

    /**
     * Runs a state transition under the reservation's room lock so that a status
     * change (which affects {@link Reservation#blocksAvailability()}) is
     * serialized with the availability checks in {@link #attemptReserve}. The
     * transition may throw {@link IllegalStateException}; the lock is always
     * released.
     */
    private void withRoomLock(Reservation r, Runnable transition) {
        ReentrantLock lock = roomLocks.get(r.room().id());
        lock.lock();
        try {
            transition.run();
        } finally {
            lock.unlock();
        }
    }

    /** Caller must hold the room lock. */
    private boolean hasOverlap(String roomId, DateRange stay) {
        for (Reservation existing : reservationsByRoom.get(roomId)) {
            if (existing.blocksAvailability() && existing.stay().overlaps(stay)) {
                return true;
            }
        }
        return false;
    }

    /** Fraction in [0,1] of rooms of {@code type} occupied for {@code stay}. Lock-free. */
    private double occupancyRatioFor(String hotelId, RoomType type, DateRange stay) {
        Hotel hotel = hotels.get(hotelId);
        if (hotel == null) {
            return 0.0;
        }
        List<Room> ofType = hotel.roomsOfType(type);
        if (ofType.isEmpty()) {
            return 0.0;
        }
        int occupied = 0;
        for (Room room : ofType) {
            CopyOnWriteArrayList<Reservation> list = reservationsByRoom.get(room.id());
            if (list == null) {
                continue;
            }
            for (Reservation existing : list) {
                if (existing.blocksAvailability() && existing.stay().overlaps(stay)) {
                    occupied++;
                    break;
                }
            }
        }
        return (double) occupied / (double) ofType.size();
    }

    private void notifyConfirmed(Reservation reservation) {
        for (BookingObserver o : observers) {
            o.onConfirmed(reservation);
        }
    }

    private Hotel requireHotel(String hotelId) {
        Hotel hotel = hotels.get(hotelId);
        if (hotel == null) {
            throw new IllegalArgumentException("unknown hotel: " + hotelId);
        }
        return hotel;
    }

    private Room requireRoom(String roomId) {
        Room room = roomsById.get(roomId);
        if (room == null) {
            throw new IllegalArgumentException("unknown room: " + roomId);
        }
        return room;
    }

    private Reservation requireReservation(String reservationId) {
        Reservation r = reservationsById.get(reservationId);
        if (r == null) {
            throw new IllegalArgumentException("unknown reservation: " + reservationId);
        }
        return r;
    }
}
