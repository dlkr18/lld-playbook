package com.you.lld.problems.airlinebooking;

import com.you.lld.problems.airlinebooking.model.Aircraft;
import com.you.lld.problems.airlinebooking.model.Airport;
import com.you.lld.problems.airlinebooking.model.Booking;
import com.you.lld.problems.airlinebooking.model.BookingStatus;
import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.Passenger;
import com.you.lld.problems.airlinebooking.model.SeatClass;
import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.service.impl.ClassBasedPricingStrategy;
import com.you.lld.problems.airlinebooking.service.impl.DynamicPricingStrategy;
import com.you.lld.problems.airlinebooking.service.impl.FrontToBackSeatAllocationStrategy;
import com.you.lld.problems.airlinebooking.service.impl.WindowPreferredSeatAllocationStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Airline Seat Booking Tests")
class AirlineBookingTest {

    private static final Airport BLR = new Airport("BLR", "Bengaluru", "Bengaluru");
    private static final Airport DEL = new Airport("DEL", "Delhi", "New Delhi");
    private static final LocalDateTime DEP = LocalDateTime.of(2026, 8, 1, 9, 30);

    private AirlineBooking airline;
    private Flight flight;

    @BeforeEach
    void setUp() {
        Aircraft a320 = Aircraft.builder("A320")
                .addCabin(SeatClass.FIRST, 1, 4)
                .addCabin(SeatClass.BUSINESS, 2, 6)
                .addCabin(SeatClass.ECONOMY, 4, 6)
                .build();
        flight = new Flight("AI501", BLR, DEL, DEP, DEP.plusHours(2), a320);
        airline = new AirlineBooking(
                new ClassBasedPricingStrategy(new BigDecimal("5000")),
                new FrontToBackSeatAllocationStrategy());
        airline.registerFlight(flight);
    }

    private Passenger passenger(String id) {
        return new Passenger(id, "Passenger " + id, id + "@ex.com");
    }

    @Test
    @DisplayName("Search returns matching flights and ignores wrong route/date")
    void searchReturnsMatchingFlights() {
        List<Flight> match = airline.searchFlights(BLR, DEL, DEP.toLocalDate());
        assertEquals(1, match.size());
        assertEquals("AI501", match.get(0).flightNumber());

        assertTrue(airline.searchFlights(DEL, BLR, DEP.toLocalDate()).isEmpty(),
                "Reversed route should not match");
        assertTrue(airline.searchFlights(BLR, DEL, LocalDate.of(2026, 8, 2)).isEmpty(),
                "Different date should not match");
    }

    @Test
    @DisplayName("Holding a seat succeeds, issues a PNR, and marks the seat unavailable")
    void holdSeatSucceeds() {
        Booking booking = airline.holdSeat("AI501", "1A", passenger("P1"));

        assertNotNull(booking.pnr());
        assertEquals(BookingStatus.HELD, booking.status());
        assertFalse(airline.isSeatAvailable("AI501", "1A"));
        // FIRST cabin fare = 5000 * 4.0
        assertEquals(0, new BigDecimal("20000.00").compareTo(booking.fare()));
    }

    @Test
    @DisplayName("A second hold on an already-held seat is rejected")
    void secondHoldOnSameSeatFails() {
        airline.holdSeat("AI501", "2A", passenger("P1"));

        SeatUnavailableException ex = assertThrows(SeatUnavailableException.class,
                () -> airline.holdSeat("AI501", "2A", passenger("P2")));
        assertTrue(ex.getMessage().contains("2A"));
    }

    @Test
    @DisplayName("An expired hold is swept, the seat is freed, and the booking becomes EXPIRED")
    void expiredHoldFreesSeat() throws InterruptedException {
        Booking booking = airline.holdSeat("AI501", "3A", passenger("P1"), Duration.ofMillis(50));
        assertFalse(airline.isSeatAvailable("AI501", "3A"));

        Thread.sleep(120);
        airline.sweepExpiredHolds();

        assertEquals(BookingStatus.EXPIRED, booking.status());
        assertTrue(airline.isSeatAvailable("AI501", "3A"), "Seat should be freed after expiry");

        // A different passenger can now hold the freed seat.
        Booking rebooked = airline.holdSeat("AI501", "3A", passenger("P2"));
        assertEquals(BookingStatus.HELD, rebooked.status());
    }

    @Test
    @DisplayName("Confirming a held seat issues a confirmed booking under the same PNR")
    void confirmIssuesPnr() {
        Booking held = airline.holdSeat("AI501", "1B", passenger("P1"));
        String pnr = held.pnr();

        Booking confirmed = airline.confirm(pnr);

        assertEquals(pnr, confirmed.pnr());
        assertEquals(BookingStatus.CONFIRMED, confirmed.status());
        assertFalse(airline.isSeatAvailable("AI501", "1B"), "Confirmed seat stays unavailable");
        // Idempotent re-confirm.
        assertEquals(BookingStatus.CONFIRMED, airline.confirm(pnr).status());
    }

    @Test
    @DisplayName("Confirming after the hold expired is rejected")
    void confirmAfterExpiryRejected() throws InterruptedException {
        Booking held = airline.holdSeat("AI501", "1C", passenger("P1"), Duration.ofMillis(50));
        Thread.sleep(120);
        airline.sweepExpiredHolds();

        assertThrows(SeatUnavailableException.class, () -> airline.confirm(held.pnr()));
        assertEquals(BookingStatus.EXPIRED, held.status());
    }

    @Test
    @DisplayName("Cancelling a confirmed booking frees the seat and is terminal")
    void cancelFreesSeat() {
        Booking held = airline.holdSeat("AI501", "2B", passenger("P1"));
        airline.confirm(held.pnr());
        assertFalse(airline.isSeatAvailable("AI501", "2B"));

        Booking cancelled = airline.cancel(held.pnr());
        assertEquals(BookingStatus.CANCELLED, cancelled.status());
        assertTrue(airline.isSeatAvailable("AI501", "2B"), "Cancelled seat should be freed");

        // Cancelling again is illegal (terminal state).
        assertThrows(IllegalStateException.class, () -> airline.cancel(held.pnr()));
    }

    @Test
    @DisplayName("Unknown PNR lookups throw BookingNotFoundException")
    void unknownPnrThrows() {
        assertThrows(BookingNotFoundException.class, () -> airline.confirm("ZZZZZZ"));
    }

    @Test
    @DisplayName("Auto-assign holds a distinct seat per passenger in the requested class")
    void autoAssignPicksDistinctSeats() {
        Booking b1 = airline.holdAnySeat("AI501", SeatClass.BUSINESS, passenger("P1"), Duration.ofMinutes(5));
        Booking b2 = airline.holdAnySeat("AI501", SeatClass.BUSINESS, passenger("P2"), Duration.ofMinutes(5));

        assertEquals(SeatClass.BUSINESS, b1.seat().seatClass());
        assertEquals(SeatClass.BUSINESS, b2.seat().seatClass());
        assertFalse(b1.seat().number().equals(b2.seat().number()), "Auto-assign must not repeat a seat");
    }

    @Test
    @DisplayName("Dynamic pricing surges the fare close to departure (Strategy swap)")
    void dynamicPricingSurgesNearDeparture() {
        // Reference 'now' is 12 hours before departure -> 1.5x surge.
        AirlineBooking surged = new AirlineBooking(
                new DynamicPricingStrategy(new BigDecimal("5000"), DEP.minusHours(12)),
                new FrontToBackSeatAllocationStrategy());
        surged.registerFlight(flight);

        Booking economy = surged.holdSeat("AI501", "4A", passenger("P1"));
        // ECONOMY: 5000 * 1.0 * 1.5 = 7500.00
        assertEquals(0, new BigDecimal("7500.00").compareTo(economy.fare()));
    }

    @Test
    @DisplayName("Window-preferred allocation picks an A-column seat (Strategy swap)")
    void windowPreferredAllocationPicksWindow() {
        AirlineBooking windowAirline = new AirlineBooking(
                new ClassBasedPricingStrategy(new BigDecimal("5000")),
                new WindowPreferredSeatAllocationStrategy());
        windowAirline.registerFlight(flight);

        Booking booking = windowAirline.holdAnySeat("AI501", SeatClass.ECONOMY, passenger("P1"), Duration.ofMinutes(5));
        Seat seat = booking.seat();
        assertEquals('A', seat.column(), "Window-preferred should pick an A-column seat");
        assertEquals(SeatClass.ECONOMY, seat.seatClass());
    }

    @Test
    @DisplayName("N threads racing for one seat: exactly one wins")
    void concurrentRaceExactlyOneWinner() throws InterruptedException {
        final int threads = 32;
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch done = new CountDownLatch(threads);
        final AtomicInteger winners = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final int id = i;
            Thread t = new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        airline.holdSeat("AI501", "4A", passenger("R" + id));
                        winners.incrementAndGet();
                    } catch (SeatUnavailableException expected) {
                        // lost the race
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    } finally {
                        done.countDown();
                    }
                }
            });
            t.start();
        }
        start.countDown();
        done.await();

        assertEquals(1, winners.get(), "Exactly one thread should win the seat");
        assertFalse(airline.isSeatAvailable("AI501", "4A"), "Seat must remain held by the winner");
    }
}
