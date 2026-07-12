package com.you.lld.problems.hotelbooking;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Guest;
import com.you.lld.problems.hotelbooking.model.Hotel;
import com.you.lld.problems.hotelbooking.model.Reservation;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.model.RoomType;
import com.you.lld.problems.hotelbooking.service.impl.ConsoleNotificationObserver;
import com.you.lld.problems.hotelbooking.service.impl.FlatPricingStrategy;
import com.you.lld.problems.hotelbooking.service.impl.OccupancyPricingStrategy;
import com.you.lld.problems.hotelbooking.service.impl.SeasonalPricingStrategy;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo. Each scenario proves one design point:
 * <ol>
 *   <li>Search + date-range reserve (half-open interval).</li>
 *   <li>Overlap rejected, back-to-back (checkout == checkin) allowed.</li>
 *   <li>State-machine lifecycle: check-in -> check-out, and illegal transitions.</li>
 *   <li>Strategy pricing: flat vs seasonal vs occupancy-driven totals.</li>
 *   <li>Concurrency: N threads race for the same room/dates -> exactly one wins.</li>
 * </ol>
 */
public final class HotelBookingDemo {

    public static void main(String[] args) throws Exception {
        HotelBooking booking = new HotelBooking(new SeasonalPricingStrategy());
        booking.addObserver(new ConsoleNotificationObserver("EMAIL"));

        Hotel grand = buildHotel();
        booking.addHotel(grand);

        Guest alice = new Guest("g1", "Alice", "alice@example.com");
        Guest bob = new Guest("g2", "Bob", "bob@example.com");
        Guest carol = new Guest("g3", "Carol", "carol@example.com");

        scenario1SearchAndReserve(booking, grand, alice);
        scenario2OverlapAndBackToBack(booking, bob, carol);
        scenario3Lifecycle(booking);
        scenario4Pricing(booking, grand);
        scenario5Concurrency();

        System.out.println("\n=== Demo complete ===");
    }

    private static Hotel buildHotel() {
        List<Room> rooms = new ArrayList<Room>();
        rooms.add(new Room("101", "grand", RoomType.SINGLE));
        rooms.add(new Room("102", "grand", RoomType.DOUBLE));
        rooms.add(new Room("103", "grand", RoomType.DOUBLE));
        rooms.add(new Room("201", "grand", RoomType.DELUXE));
        rooms.add(new Room("301", "grand", RoomType.SUITE));
        return new Hotel("grand", "Grand Plaza", rooms);
    }

    private static void scenario1SearchAndReserve(HotelBooking booking, Hotel hotel, Guest guest) {
        header("Scenario 1 — search available DOUBLE rooms and reserve a date range");
        DateRange stay = new DateRange(LocalDate.of(2026, 3, 10), LocalDate.of(2026, 3, 13));
        List<Room> found = booking.searchAvailable(hotel.id(), RoomType.DOUBLE, stay, 2);
        System.out.println("  Available DOUBLE rooms for " + stay + ": " + ids(found));
        Reservation r = booking.reserve(found.get(0).id(), guest, stay);
        System.out.println("  Reserved -> " + r);
    }

    private static void scenario2OverlapAndBackToBack(HotelBooking booking, Guest bob, Guest carol) {
        header("Scenario 2 — overlap rejected, back-to-back allowed (half-open [in,out))");
        // Room 102 booked 2026-03-10..13 in scenario 1.
        DateRange overlapping = new DateRange(LocalDate.of(2026, 3, 12), LocalDate.of(2026, 3, 15));
        try {
            booking.reserve("102", bob, overlapping);
            System.out.println("  UNEXPECTED: overlapping reservation succeeded");
        } catch (RoomNotAvailableException e) {
            System.out.println("  Overlap correctly rejected: " + e.getMessage());
        }
        // Check-out day (13th) is exclusive, so a stay STARTING on the 13th is fine.
        DateRange backToBack = new DateRange(LocalDate.of(2026, 3, 13), LocalDate.of(2026, 3, 16));
        Reservation r = booking.reserve("102", carol, backToBack);
        System.out.println("  Back-to-back reservation allowed -> " + r);
    }

    private static void scenario3Lifecycle(HotelBooking booking) {
        header("Scenario 3 — reservation state machine (RESERVED -> CHECKED_IN -> CHECKED_OUT)");
        Guest dave = new Guest("g4", "Dave", "dave@example.com");
        DateRange stay = new DateRange(LocalDate.of(2026, 4, 1), LocalDate.of(2026, 4, 3));
        Reservation r = booking.reserve("201", dave, stay);
        System.out.println("  status=" + r.status());
        booking.checkIn(r.id());
        System.out.println("  status=" + r.status());
        try {
            booking.cancel(r.id()); // illegal from CHECKED_IN
        } catch (IllegalStateException e) {
            System.out.println("  Illegal transition blocked: " + e.getMessage());
        }
        booking.checkOut(r.id());
        System.out.println("  status=" + r.status());

        // Cancelling frees the room's dates for re-booking.
        Guest erin = new Guest("g5", "Erin", "erin@example.com");
        Reservation c = booking.reserve("301", erin, stay);
        booking.cancel(c.id());
        List<Room> freed = booking.searchAvailable("grand", RoomType.SUITE, stay, 1);
        System.out.println("  after cancel, SUITE available again: " + ids(freed));
    }

    private static void scenario4Pricing(HotelBooking booking, Hotel hotel) {
        header("Scenario 4 — Strategy pricing: flat vs seasonal vs occupancy");
        Room deluxe = hotel.roomsOfType(RoomType.DELUXE).get(0);
        // Peak (July) 4-night stay: base 200 * 1.5 * 4 = 1200 under seasonal.
        DateRange july = new DateRange(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5));

        booking.setPricingStrategy(new FlatPricingStrategy());
        System.out.println("  Flat total     (200 * 4)          = $"
                + new FlatPricingStrategy().totalFor(deluxe, july, 0.0));

        booking.setPricingStrategy(new SeasonalPricingStrategy());
        System.out.println("  Seasonal total (200 * 1.5 * 4)    = $"
                + new SeasonalPricingStrategy().totalFor(deluxe, july, 0.0));

        System.out.println("  Occupancy total @0%  occupancy    = $"
                + new OccupancyPricingStrategy().totalFor(deluxe, july, 0.0));
        System.out.println("  Occupancy total @100% occupancy   = $"
                + new OccupancyPricingStrategy().totalFor(deluxe, july, 1.0));
    }

    private static void scenario5Concurrency() throws InterruptedException {
        header("Scenario 5 — 8 threads race for the SAME room + dates; exactly one wins");
        HotelBooking booking = new HotelBooking(new FlatPricingStrategy());
        List<Room> rooms = new ArrayList<Room>();
        rooms.add(new Room("777", "raceHotel", RoomType.SUITE));
        booking.addHotel(new Hotel("raceHotel", "Race Hotel", rooms));

        final DateRange stay = new DateRange(LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 4));
        final int threads = 8;
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch done = new CountDownLatch(threads);
        final AtomicInteger wins = new AtomicInteger();

        for (int i = 0; i < threads; i++) {
            final int idx = i;
            new Thread(new Runnable() {
                public void run() {
                    try {
                        start.await();
                        booking.reserve("777", new Guest("gc" + idx, "Racer" + idx, null), stay);
                        wins.incrementAndGet();
                    } catch (RoomNotAvailableException ignored) {
                        // expected for all but one
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    } finally {
                        done.countDown();
                    }
                }
            }).start();
        }
        start.countDown();
        done.await();
        System.out.println("  Winners: " + wins.get() + " (expected exactly 1)");
    }

    private static List<String> ids(List<Room> rooms) {
        List<String> out = new ArrayList<String>();
        for (Room r : rooms) {
            out.add(r.id());
        }
        return out;
    }

    private static void header(String title) {
        System.out.println("\n=== " + title + " ===");
    }
}
