package com.you.lld.problems.airlinebooking;

import com.you.lld.problems.airlinebooking.model.Aircraft;
import com.you.lld.problems.airlinebooking.model.Airport;
import com.you.lld.problems.airlinebooking.model.Booking;
import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.model.Passenger;
import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.model.SeatClass;
import com.you.lld.problems.airlinebooking.service.impl.ClassBasedPricingStrategy;
import com.you.lld.problems.airlinebooking.service.impl.EmailBookingObserver;
import com.you.lld.problems.airlinebooking.service.impl.FrontToBackSeatAllocationStrategy;
import com.you.lld.problems.airlinebooking.service.impl.SmsBookingObserver;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo. Each scenario proves one design point:
 * <ol>
 *   <li>Search + seat-map pricing per class (Strategy).</li>
 *   <li>Hold → confirm → PNR issuance, with Observer notifications.</li>
 *   <li>Double-hold on the same seat fails (per-seat CAS).</li>
 *   <li>Hold TTL expires and frees the seat (sweeper + State).</li>
 *   <li>N threads race for one seat — exactly one wins (concurrency).</li>
 * </ol>
 */
public final class AirlineBookingDemo {

    public static void main(String[] args) throws Exception {
        Airport blr = new Airport("BLR", "Kempegowda Intl", "Bengaluru");
        Airport del = new Airport("DEL", "Indira Gandhi Intl", "New Delhi");

        // A320 seat map: 1 row FIRST (4), 2 rows BUSINESS (6/row), 4 rows ECONOMY (6/row).
        Aircraft a320 = Aircraft.builder("A320")
                .addCabin(SeatClass.FIRST, 1, 4)
                .addCabin(SeatClass.BUSINESS, 2, 6)
                .addCabin(SeatClass.ECONOMY, 4, 6)
                .build();

        LocalDateTime dep = LocalDateTime.of(2026, 8, 1, 9, 30);
        Flight ai501 = new Flight("AI501", blr, del, dep, dep.plusHours(2).plusMinutes(45), a320);

        AirlineBooking airline = new AirlineBooking(
                new ClassBasedPricingStrategy(new BigDecimal("5000")),
                new FrontToBackSeatAllocationStrategy());
        airline.addObserver(new EmailBookingObserver());
        airline.addObserver(new SmsBookingObserver());
        airline.registerFlight(ai501);

        try {
            scenario1Search(airline, blr, del, dep.toLocalDate());
            scenario2HoldConfirm(airline);
            scenario3DoubleHold(airline);
            scenario4Expiry(airline);
            scenario5Race(airline);
        } finally {
            airline.close();
        }
    }

    private static void scenario1Search(AirlineBooking airline, Airport from, Airport to, LocalDate date) {
        header("Scenario 1: search flights + per-class fares (Strategy)");
        List<Flight> flights = airline.searchFlights(from, to, date);
        System.out.println("Found " + flights.size() + " flight(s) " + from + "->" + to + " on " + date);
        for (int i = 0; i < flights.size(); i++) {
            Flight f = flights.get(i);
            System.out.println("  " + f.flightNumber() + " departs " + f.departure()
                    + " aircraft " + f.aircraft().model()
                    + " capacity " + f.aircraft().capacity());
        }
        System.out.println("  Available seats -> FIRST:" + airline.availableSeats("AI501", SeatClass.FIRST).size()
                + " BUSINESS:" + airline.availableSeats("AI501", SeatClass.BUSINESS).size()
                + " ECONOMY:" + airline.availableSeats("AI501", SeatClass.ECONOMY).size());
    }

    private static void scenario2HoldConfirm(AirlineBooking airline) {
        header("Scenario 2: hold a specific seat -> confirm -> PNR + notifications");
        Passenger asha = new Passenger("P1", "Asha Rao", "asha@example.com");
        Booking hold = airline.holdSeat("AI501", "1A", asha);
        System.out.println("Held: " + hold);
        Booking confirmed = airline.confirm(hold.pnr());
        System.out.println("Confirmed: " + confirmed);
        System.out.println("Seat 1A available now? " + airline.isSeatAvailable("AI501", "1A"));
    }

    private static void scenario3DoubleHold(AirlineBooking airline) {
        header("Scenario 3: two passengers, same seat -> second hold rejected (per-seat CAS)");
        Passenger bob = new Passenger("P2", "Bob Lee", "bob@example.com");
        Passenger cara = new Passenger("P3", "Cara Ng", "cara@example.com");
        Booking first = airline.holdSeat("AI501", "2A", bob);
        System.out.println("Bob held 2A -> " + first.pnr());
        try {
            airline.holdSeat("AI501", "2A", cara);
            System.out.println("ERROR: Cara should not have held 2A");
        } catch (SeatUnavailableException ex) {
            System.out.println("Cara rejected as expected: " + ex.getMessage());
        }
    }

    private static void scenario4Expiry(AirlineBooking airline) throws InterruptedException {
        header("Scenario 4: hold TTL expires and frees the seat (sweeper + State)");
        Passenger dan = new Passenger("P4", "Dan Roy", "dan@example.com");
        Booking hold = airline.holdSeat("AI501", "3A", dan, Duration.ofMillis(100));
        System.out.println("Dan held 3A with 100ms TTL, status=" + hold.status()
                + ", available? " + airline.isSeatAvailable("AI501", "3A"));
        Thread.sleep(200);
        airline.sweepExpiredHolds();
        System.out.println("After TTL + sweep -> booking status=" + hold.status()
                + ", seat 3A available? " + airline.isSeatAvailable("AI501", "3A"));
        try {
            airline.confirm(hold.pnr());
            System.out.println("ERROR: expired hold should not confirm");
        } catch (SeatUnavailableException ex) {
            System.out.println("Confirm on expired hold rejected: " + ex.getMessage());
        }
    }

    private static void scenario5Race(AirlineBooking airline) throws InterruptedException {
        header("Scenario 5: 20 threads race for seat 4A -> exactly one wins");
        final String seat = "4A";
        final int threads = 20;
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
                        Passenger p = new Passenger("R" + id, "Racer " + id, "r" + id + "@ex.com");
                        airline.holdSeat("AI501", seat, p);
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
        System.out.println("Winners for seat 4A: " + winners.get() + " (expected 1)");
        System.out.println("Seat 4A available now? " + airline.isSeatAvailable("AI501", seat) + " (expected false)");
    }

    private static void header(String title) {
        System.out.println();
        System.out.println("==================================================");
        System.out.println(title);
        System.out.println("==================================================");
    }
}
