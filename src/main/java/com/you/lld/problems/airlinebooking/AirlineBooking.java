package com.you.lld.problems.airlinebooking;

import com.you.lld.problems.airlinebooking.model.Airport;
import com.you.lld.problems.airlinebooking.model.Booking;
import com.you.lld.problems.airlinebooking.model.BookingStatus;
import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.Passenger;
import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.model.SeatClass;
import com.you.lld.problems.airlinebooking.service.BookingObserver;
import com.you.lld.problems.airlinebooking.service.FarePricingStrategy;
import com.you.lld.problems.airlinebooking.service.FlightSearchService;
import com.you.lld.problems.airlinebooking.service.SeatAllocationStrategy;
import com.you.lld.problems.airlinebooking.service.impl.InMemoryFlightSearchService;
import com.you.lld.problems.airlinebooking.service.impl.SeatInventory;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

/**
 * Facade / orchestrator an interviewer sees first. It wires together flight
 * search, per-flight {@link SeatInventory} (the concurrency layer), the pricing
 * and allocation {@code Strategy} objects, and the {@code Observer} notification
 * fan-out, and it drives the {@code State}-based booking lifecycle.
 *
 * <h3>Concurrency model (stated explicitly)</h3>
 * <ul>
 *   <li><b>Seat reservation</b> — the only mutation that must be race-free is
 *       AVAILABLE→HELD and HELD→BOOKED. Each seat owns an {@code AtomicReference}
 *       in {@link SeatInventory}; reservation is a lock-free compare-and-set, so
 *       exactly one of N racing threads wins a given seat and no global lock is
 *       taken. Holds on different seats never contend.</li>
 *   <li><b>Registries</b> — {@code bookings} is a {@link ConcurrentMap};
 *       observers use a {@link CopyOnWriteArrayList}. Flight registration uses a
 *       {@link ConcurrentMap} inside the search service.</li>
 *   <li><b>Hold TTL</b> — every hold carries an expiry instant. A background
 *       single-thread scheduler calls {@link #sweepExpiredHolds()} to release
 *       stale holds and move their bookings to EXPIRED. Reservation is <em>also</em>
 *       lazily self-healing: {@code tryHold} treats an expired hold as available
 *       and CASes over it even before the sweeper runs.</li>
 *   <li><b>Booking state</b> — transitions are {@code synchronized} on the
 *       booking, but the authoritative winner is decided by the seat CAS; state
 *       is only advanced after winning it.</li>
 * </ul>
 */
public final class AirlineBooking implements AutoCloseable {

    private static final Duration DEFAULT_HOLD_TTL = Duration.ofMinutes(5);

    private final FlightSearchService searchService = new InMemoryFlightSearchService();
    private final ConcurrentMap<String, SeatInventory> inventories =
            new ConcurrentHashMap<String, SeatInventory>();
    private final ConcurrentMap<String, Booking> bookings =
            new ConcurrentHashMap<String, Booking>();
    private final CopyOnWriteArrayList<BookingObserver> observers =
            new CopyOnWriteArrayList<BookingObserver>();

    private final FarePricingStrategy pricingStrategy;
    private final SeatAllocationStrategy allocationStrategy;
    private final Duration defaultHoldTtl;
    private final ScheduledExecutorService sweeper;

    /**
     * Creates an orchestrator with a manual expiry sweep (no background thread).
     * Callers drive expiry via {@link #sweepExpiredHolds()} — convenient for
     * deterministic tests.
     */
    public AirlineBooking(FarePricingStrategy pricingStrategy,
                          SeatAllocationStrategy allocationStrategy) {
        this(pricingStrategy, allocationStrategy, DEFAULT_HOLD_TTL, null);
    }

    /**
     * Creates an orchestrator with a background sweeper firing every
     * {@code sweepInterval}.
     */
    public AirlineBooking(FarePricingStrategy pricingStrategy,
                          SeatAllocationStrategy allocationStrategy,
                          Duration defaultHoldTtl,
                          Duration sweepInterval) {
        if (pricingStrategy == null || allocationStrategy == null) {
            throw new IllegalArgumentException("Pricing and allocation strategies are required");
        }
        if (defaultHoldTtl == null || defaultHoldTtl.isZero() || defaultHoldTtl.isNegative()) {
            throw new IllegalArgumentException("Default hold TTL must be positive");
        }
        this.pricingStrategy = pricingStrategy;
        this.allocationStrategy = allocationStrategy;
        this.defaultHoldTtl = defaultHoldTtl;
        if (sweepInterval != null) {
            if (sweepInterval.isZero() || sweepInterval.isNegative()) {
                throw new IllegalArgumentException("Sweep interval must be positive");
            }
            this.sweeper = Executors.newSingleThreadScheduledExecutor(new DaemonThreadFactory());
            long millis = sweepInterval.toMillis();
            this.sweeper.scheduleAtFixedRate(new Runnable() {
                @Override
                public void run() {
                    sweepExpiredHolds();
                }
            }, millis, millis, TimeUnit.MILLISECONDS);
        } else {
            this.sweeper = null;
        }
    }

    // ---------------------------------------------------------------------
    // Catalog
    // ---------------------------------------------------------------------

    /** Registers a flight and provisions its seat inventory. */
    public void registerFlight(Flight flight) {
        if (flight == null) {
            throw new IllegalArgumentException("Flight is required");
        }
        SeatInventory existing = inventories.putIfAbsent(
                flight.flightNumber(), new SeatInventory(flight.aircraft()));
        if (existing != null) {
            throw new IllegalArgumentException("Flight already registered: " + flight.flightNumber());
        }
        searchService.addFlight(flight);
    }

    public List<Flight> searchFlights(Airport origin, Airport destination, LocalDate date) {
        return searchService.search(origin, destination, date);
    }

    // ---------------------------------------------------------------------
    // Observers (subject side of Observer pattern)
    // ---------------------------------------------------------------------

    public void addObserver(BookingObserver observer) {
        if (observer != null) {
            observers.add(observer);
        }
    }

    // ---------------------------------------------------------------------
    // Hold
    // ---------------------------------------------------------------------

    /** Holds a specific seat for the default TTL. */
    public Booking holdSeat(String flightNumber, String seatNumber, Passenger passenger) {
        return holdSeat(flightNumber, seatNumber, passenger, defaultHoldTtl);
    }

    /**
     * Holds a specific seat for {@code ttl}. Issues a PNR immediately and returns
     * the booking in HELD state. Throws {@link SeatUnavailableException} if the
     * seat is already taken.
     */
    public Booking holdSeat(String flightNumber, String seatNumber, Passenger passenger, Duration ttl) {
        Flight flight = requireFlight(flightNumber);
        SeatInventory inventory = inventories.get(flight.flightNumber());
        if (passenger == null) {
            throw new IllegalArgumentException("Passenger is required");
        }
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            throw new IllegalArgumentException("TTL must be positive");
        }
        if (!inventory.hasSeat(seatNumber)) {
            throw new IllegalArgumentException("Flight " + flight.flightNumber()
                    + " has no seat " + seatNumber);
        }
        Booking booking = createAndHold(flight, inventory, inventory.seat(seatNumber), passenger, ttl);
        if (booking == null) {
            throw new SeatUnavailableException("Seat " + seatNumber
                    + " on " + flight.flightNumber() + " is not available");
        }
        return booking;
    }

    /**
     * Auto-assigns and holds any seat in the requested class using the configured
     * {@link SeatAllocationStrategy}. Retries across candidates if it loses a race.
     */
    public Booking holdAnySeat(String flightNumber, SeatClass seatClass, Passenger passenger, Duration ttl) {
        Flight flight = requireFlight(flightNumber);
        SeatInventory inventory = inventories.get(flight.flightNumber());
        if (seatClass == null) {
            throw new IllegalArgumentException("Seat class is required");
        }
        Duration effectiveTtl = ttl == null ? defaultHoldTtl : ttl;

        // Bound the retry count so heavy contention cannot spin forever.
        int maxAttempts = inventory.availableSeats(seatClass).size() + 1;
        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            List<Seat> candidates = inventory.availableSeats(seatClass);
            Optional<Seat> pick = allocationStrategy.pick(candidates);
            if (!pick.isPresent()) {
                break;
            }
            Booking booking = createAndHold(flight, inventory, pick.get(), passenger, effectiveTtl);
            if (booking != null) {
                return booking;
            }
            // Lost the race for that seat; loop and pick another.
        }
        throw new SeatUnavailableException("No seats available in " + seatClass
                + " on " + flight.flightNumber());
    }

    /**
     * Registers the booking first (so a concurrent sweep can always find it),
     * then attempts the seat CAS. Returns {@code null} if the seat was taken.
     */
    private Booking createAndHold(Flight flight,
                                  SeatInventory inventory,
                                  Seat seat,
                                  Passenger passenger,
                                  Duration ttl) {
        Instant expiry = Instant.now().plusMillis(ttl.toMillis());
        BigDecimal fare = pricingStrategy.price(flight, seat.seatClass());
        String pnr = newPnr();
        Booking booking = new Booking(pnr, flight, seat, passenger, fare, expiry);
        bookings.put(pnr, booking);
        if (!inventory.tryHold(seat.number(), pnr, expiry)) {
            bookings.remove(pnr);
            return null;
        }
        return booking;
    }

    // ---------------------------------------------------------------------
    // Confirm / Cancel
    // ---------------------------------------------------------------------

    /**
     * Confirms a held booking into a ticketed one. Idempotent for an
     * already-confirmed PNR. Throws {@link SeatUnavailableException} if the hold
     * expired or was lost.
     */
    public Booking confirm(String pnr) {
        Booking booking = requireBooking(pnr);
        if (booking.status() == BookingStatus.CONFIRMED) {
            return booking; // idempotent
        }
        SeatInventory inventory = inventories.get(booking.flight().flightNumber());
        if (!inventory.confirm(booking.seat().number(), pnr)) {
            // The hold is no longer valid — reflect that on the booking.
            if (booking.status() == BookingStatus.HELD) {
                try {
                    booking.expire();
                } catch (IllegalStateException ignored) {
                    // A concurrent sweep already expired it.
                }
            }
            throw new SeatUnavailableException("Hold for PNR " + pnr
                    + " is no longer valid (expired or released)");
        }
        booking.confirm(); // HELD -> CONFIRMED
        notifyConfirmed(booking);
        return booking;
    }

    /**
     * Cancels a HELD or CONFIRMED booking, releasing its seat. Throws
     * {@link IllegalStateException} if the booking is already terminal.
     */
    public Booking cancel(String pnr) {
        Booking booking = requireBooking(pnr);
        booking.cancel(); // validates the transition (throws if terminal)
        SeatInventory inventory = inventories.get(booking.flight().flightNumber());
        inventory.release(booking.seat().number(), pnr);
        notifyCancelled(booking);
        return booking;
    }

    // ---------------------------------------------------------------------
    // Expiry
    // ---------------------------------------------------------------------

    /**
     * Releases all holds whose TTL has elapsed and moves their bookings to
     * EXPIRED. Called on a schedule by the background sweeper, and may be invoked
     * manually (e.g. from tests) to drive expiry deterministically.
     */
    public void sweepExpiredHolds() {
        Instant now = Instant.now();
        for (SeatInventory inventory : inventories.values()) {
            List<String> freed = inventory.sweepExpired(now);
            for (int i = 0; i < freed.size(); i++) {
                Booking booking = bookings.get(freed.get(i));
                if (booking != null && booking.status() == BookingStatus.HELD) {
                    try {
                        booking.expire();
                    } catch (IllegalStateException ignored) {
                        // Raced with confirm/cancel; the winner already set the state.
                    }
                }
            }
        }
    }

    // ---------------------------------------------------------------------
    // Read helpers
    // ---------------------------------------------------------------------

    public Booking getBooking(String pnr) {
        return bookings.get(pnr);
    }

    public List<Seat> availableSeats(String flightNumber, SeatClass seatClass) {
        Flight flight = requireFlight(flightNumber);
        return inventories.get(flight.flightNumber()).availableSeats(seatClass);
    }

    public boolean isSeatAvailable(String flightNumber, String seatNumber) {
        Flight flight = requireFlight(flightNumber);
        return inventories.get(flight.flightNumber()).isAvailable(seatNumber);
    }

    // ---------------------------------------------------------------------
    // Internals
    // ---------------------------------------------------------------------

    private void notifyConfirmed(Booking booking) {
        for (BookingObserver observer : observers) {
            try {
                observer.onConfirmed(booking);
            } catch (RuntimeException ex) {
                System.err.println("Observer failed on confirm: " + ex.getMessage());
            }
        }
    }

    private void notifyCancelled(Booking booking) {
        for (BookingObserver observer : observers) {
            try {
                observer.onCancelled(booking);
            } catch (RuntimeException ex) {
                System.err.println("Observer failed on cancel: " + ex.getMessage());
            }
        }
    }

    private Flight requireFlight(String flightNumber) {
        Flight flight = searchService.findByNumber(flightNumber);
        if (flight == null) {
            throw new IllegalArgumentException("Unknown flight: " + flightNumber);
        }
        return flight;
    }

    private Booking requireBooking(String pnr) {
        Booking booking = pnr == null ? null : bookings.get(pnr);
        if (booking == null) {
            throw new BookingNotFoundException("Unknown PNR: " + pnr);
        }
        return booking;
    }

    private static final char[] PNR_ALPHABET =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    /** Generates a unique 6-character record locator. */
    private String newPnr() {
        for (;;) {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(PNR_ALPHABET[ThreadLocalRandom.current().nextInt(PNR_ALPHABET.length)]);
            }
            String candidate = sb.toString();
            if (!bookings.containsKey(candidate)) {
                return candidate;
            }
        }
    }

    /** Shuts down the background sweeper, if any. */
    @Override
    public void close() {
        if (sweeper != null) {
            sweeper.shutdownNow();
        }
    }

    private static final class DaemonThreadFactory implements ThreadFactory {
        @Override
        public Thread newThread(Runnable r) {
            Thread t = new Thread(r, "airline-hold-sweeper");
            t.setDaemon(true);
            return t;
        }
    }
}
