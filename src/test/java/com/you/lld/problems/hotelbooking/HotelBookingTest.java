package com.you.lld.problems.hotelbooking;

import com.you.lld.problems.hotelbooking.model.DateRange;
import com.you.lld.problems.hotelbooking.model.Guest;
import com.you.lld.problems.hotelbooking.model.Hotel;
import com.you.lld.problems.hotelbooking.model.Reservation;
import com.you.lld.problems.hotelbooking.model.ReservationStatus;
import com.you.lld.problems.hotelbooking.model.Room;
import com.you.lld.problems.hotelbooking.model.RoomType;
import com.you.lld.problems.hotelbooking.service.impl.FlatPricingStrategy;
import com.you.lld.problems.hotelbooking.service.impl.SeasonalPricingStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Hotel Booking Tests")
class HotelBookingTest {

    private HotelBooking booking;

    private static final Guest ALICE = new Guest("g1", "Alice", "a@x.com");
    private static final Guest BOB = new Guest("g2", "Bob", "b@x.com");

    @BeforeEach
    void setUp() {
        booking = new HotelBooking(new FlatPricingStrategy());
        booking.addHotel(hotel());
    }

    private Hotel hotel() {
        List<Room> rooms = new ArrayList<Room>();
        rooms.add(new Room("101", "h1", RoomType.SINGLE)); // cap 1
        rooms.add(new Room("102", "h1", RoomType.DOUBLE)); // cap 2
        rooms.add(new Room("103", "h1", RoomType.DOUBLE)); // cap 2
        rooms.add(new Room("201", "h1", RoomType.SUITE));  // cap 4
        return new Hotel("h1", "Test Hotel", rooms);
    }

    private static DateRange range(int m1, int d1, int m2, int d2) {
        return new DateRange(LocalDate.of(2026, m1, d1), LocalDate.of(2026, m2, d2));
    }

    @Test
    @DisplayName("Reserve succeeds and starts in RESERVED")
    void reserveSucceeds() {
        Reservation r = booking.reserve("102", ALICE, range(3, 10, 3, 13));
        assertEquals(ReservationStatus.RESERVED, r.status());
        assertEquals("102", r.room().id());
        assertEquals(ALICE, r.guest());
    }

    @Test
    @DisplayName("Overlapping dates on the same room are rejected")
    void overlappingRejected() {
        booking.reserve("102", ALICE, range(3, 10, 3, 13));
        assertThrows(RoomNotAvailableException.class,
                () -> booking.reserve("102", BOB, range(3, 12, 3, 15)));
        // A fully-contained overlap is also rejected.
        assertThrows(RoomNotAvailableException.class,
                () -> booking.reserve("102", BOB, range(3, 11, 3, 12)));
    }

    @Test
    @DisplayName("Back-to-back stays (checkout == checkin) are allowed")
    void backToBackAllowed() {
        booking.reserve("102", ALICE, range(3, 10, 3, 13));
        Reservation r = booking.reserve("102", BOB, range(3, 13, 3, 16));
        assertEquals(ReservationStatus.RESERVED, r.status());
    }

    @Test
    @DisplayName("Cancel frees the room's dates for re-booking")
    void cancelFreesRoom() {
        Reservation first = booking.reserve("201", ALICE, range(4, 1, 4, 5));
        assertThrows(RoomNotAvailableException.class,
                () -> booking.reserve("201", BOB, range(4, 2, 4, 4)));

        booking.cancel(first.id());
        assertEquals(ReservationStatus.CANCELLED, first.status());

        Reservation second = booking.reserve("201", BOB, range(4, 2, 4, 4));
        assertEquals(ReservationStatus.RESERVED, second.status());
    }

    @Test
    @DisplayName("Search honors room type, capacity, and date availability")
    void searchHonorsTypeCapacityDates() {
        DateRange stay = range(3, 10, 3, 13);
        // Two DOUBLE rooms available initially.
        List<Room> doubles = booking.searchAvailable("h1", RoomType.DOUBLE, stay, 2);
        assertEquals(2, doubles.size());

        // SINGLE (cap 1) cannot satisfy minCapacity=2.
        assertTrue(booking.searchAvailable("h1", RoomType.SINGLE, stay, 2).isEmpty());

        // Reserve one DOUBLE -> only one left for overlapping dates.
        booking.reserve("102", ALICE, stay);
        List<Room> afterOverlap = booking.searchAvailable("h1", RoomType.DOUBLE, range(3, 12, 3, 14), 2);
        assertEquals(1, afterOverlap.size());
        assertEquals("103", afterOverlap.get(0).id());

        // A non-overlapping window still sees both DOUBLE rooms.
        List<Room> later = booking.searchAvailable("h1", RoomType.DOUBLE, range(3, 20, 3, 22), 2);
        assertEquals(2, later.size());
    }

    @Test
    @DisplayName("Seasonal pricing total is correct across a season boundary")
    void seasonalPricingTotal() {
        booking.setPricingStrategy(new SeasonalPricingStrategy());
        // SUITE base 350. Nov 29,30 off-peak (x1.0), Dec 1,2 peak (x1.5).
        // 350*1 + 350*1 + 350*1.5 + 350*1.5 = 700 + 1050 = 1750.00
        Reservation r = booking.reserve("201", ALICE,
                new DateRange(LocalDate.of(2026, 11, 29), LocalDate.of(2026, 12, 3)));
        assertEquals(new BigDecimal("1750.00"), r.totalPrice());
    }

    @Test
    @DisplayName("Flat pricing total is baseRate * nights")
    void flatPricingTotal() {
        // DOUBLE base 120, 3 nights = 360.00
        Reservation r = booking.reserve("102", ALICE, range(3, 10, 3, 13));
        assertEquals(new BigDecimal("360.00"), r.totalPrice());
    }

    @Test
    @DisplayName("Illegal lifecycle transitions are blocked by the state machine")
    void illegalTransitionsBlocked() {
        Reservation r = booking.reserve("201", ALICE, range(4, 1, 4, 3));
        // Cannot check out before checking in.
        assertThrows(IllegalStateException.class, () -> booking.checkOut(r.id()));
        booking.checkIn(r.id());
        assertEquals(ReservationStatus.CHECKED_IN, r.status());
        // Cannot cancel once checked in.
        assertThrows(IllegalStateException.class, () -> booking.cancel(r.id()));
        booking.checkOut(r.id());
        assertEquals(ReservationStatus.CHECKED_OUT, r.status());
    }

    @Test
    @DisplayName("Concurrency: N threads race for one room/dates -> exactly one wins")
    void concurrencyExactlyOneWinner() throws InterruptedException {
        final int threads = 32;
        final DateRange stay = range(5, 1, 5, 4);
        final ExecutorService pool = Executors.newFixedThreadPool(threads);
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch done = new CountDownLatch(threads);
        final AtomicInteger wins = new AtomicInteger();
        final AtomicInteger rejects = new AtomicInteger();

        for (int i = 0; i < threads; i++) {
            final int idx = i;
            pool.submit(new Runnable() {
                public void run() {
                    try {
                        start.await();
                        booking.reserve("201", new Guest("r" + idx, "Racer" + idx, null), stay);
                        wins.incrementAndGet();
                    } catch (RoomNotAvailableException e) {
                        rejects.incrementAndGet();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        start.countDown();
        assertTrue(done.await(10, TimeUnit.SECONDS), "threads did not finish in time");
        pool.shutdownNow();

        assertEquals(1, wins.get(), "exactly one reservation should succeed");
        assertEquals(threads - 1, rejects.get(), "all other attempts should be rejected");

        // And the winner still occupies the room afterwards.
        assertFalse(booking.searchAvailable("h1", RoomType.SUITE, stay, 1).contains(
                new Room("201", "h1", RoomType.SUITE)));
    }
}
