package com.you.lld.problems.carrental;

import com.you.lld.problems.carrental.model.Car;
import com.you.lld.problems.carrental.model.CarStatus;
import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.Charges;
import com.you.lld.problems.carrental.model.Customer;
import com.you.lld.problems.carrental.model.DateRange;
import com.you.lld.problems.carrental.model.Location;
import com.you.lld.problems.carrental.model.Reservation;
import com.you.lld.problems.carrental.model.ReservationStatus;
import com.you.lld.problems.carrental.service.LateFeePolicy;
import com.you.lld.problems.carrental.service.PricingStrategy;
import com.you.lld.problems.carrental.service.impl.DailyPricingStrategy;
import com.you.lld.problems.carrental.service.impl.StandardLateFeePolicy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Car Rental System Tests")
class CarRentalTest {

    private CarRental rental;
    private Location downtown;
    private Location airport;

    private static final DateRange JUL_10_13 =
            new DateRange(LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 13)); // 3 days
    private static final DateRange JUL_13_15 =
            new DateRange(LocalDate.of(2026, 7, 13), LocalDate.of(2026, 7, 15)); // back-to-back
    private static final DateRange JUL_12_14 =
            new DateRange(LocalDate.of(2026, 7, 12), LocalDate.of(2026, 7, 14)); // overlaps JUL_10_13

    private static Map<CarType, BigDecimal> rates() {
        Map<CarType, BigDecimal> r = new EnumMap<CarType, BigDecimal>(CarType.class);
        r.put(CarType.ECONOMY, new BigDecimal("40"));
        r.put(CarType.SUV, new BigDecimal("70"));
        r.put(CarType.LUXURY, new BigDecimal("120"));
        return r;
    }

    @BeforeEach
    void setUp() {
        PricingStrategy pricing = new DailyPricingStrategy(rates());
        LateFeePolicy lateFee = new StandardLateFeePolicy(rates(), new BigDecimal("1.5"));
        rental = new CarRental(pricing, lateFee);

        downtown = new Location("LOC-DT", "Downtown");
        airport = new Location("LOC-AP", "Airport");
        rental.addLocation(downtown);
        rental.addLocation(airport);

        rental.addCar(new Car("C1", "ECO-1", CarType.ECONOMY, downtown));
        rental.addCar(new Car("C2", "ECO-2", CarType.ECONOMY, airport));
        rental.addCar(new Car("C3", "SUV-1", CarType.SUV, downtown));
        rental.addCar(new Car("C4", "LUX-1", CarType.LUXURY, airport));

        rental.registerCustomer(new Customer("U1", "Alice", "alice@example.com"));
        rental.registerCustomer(new Customer("U2", "Bob", "bob@example.com"));
    }

    @Test
    @DisplayName("Reserve succeeds and freezes the quoted base cost")
    void reserveSucceeds() {
        Reservation r = rental.reserve("U1", "C1", JUL_10_13);

        assertEquals(ReservationStatus.RESERVED, r.getStatus());
        assertEquals("C1", r.getCar().getId());
        // 3 days x $40
        assertEquals(0, new BigDecimal("120").compareTo(r.getBaseCost()));
        assertTrue(r.isActive());
    }

    @Test
    @DisplayName("Overlapping dates for the same car are rejected")
    void overlappingReservationRejected() {
        rental.reserve("U1", "C1", JUL_10_13);

        CarUnavailableException ex = assertThrows(CarUnavailableException.class,
                () -> rental.reserve("U2", "C1", JUL_12_14));
        assertTrue(ex.getMessage().contains("C1"));
    }

    @Test
    @DisplayName("Back-to-back rentals (touching endpoints) are allowed")
    void backToBackAllowed() {
        Reservation first = rental.reserve("U1", "C1", JUL_10_13);   // [10,13)
        Reservation second = rental.reserve("U2", "C1", JUL_13_15);  // [13,15)

        assertEquals(ReservationStatus.RESERVED, first.getStatus());
        assertEquals(ReservationStatus.RESERVED, second.getStatus());
    }

    @Test
    @DisplayName("Cancel frees the car for the same window")
    void cancelFreesTheCar() {
        Reservation r = rental.reserve("U1", "C1", JUL_10_13);
        // Before cancel the car is not searchable for that window.
        assertFalse(rental.searchAvailableCars(CarType.ECONOMY, downtown, JUL_10_13).contains(r.getCar()));

        rental.cancel(r.getId());

        assertEquals(ReservationStatus.CANCELLED, r.getStatus());
        // Now it is available again and can be re-reserved.
        assertTrue(rental.searchAvailableCars(CarType.ECONOMY, downtown, JUL_10_13).contains(r.getCar()));
        Reservation reBooked = rental.reserve("U2", "C1", JUL_10_13);
        assertEquals(ReservationStatus.RESERVED, reBooked.getStatus());
    }

    @Test
    @DisplayName("Search honors type, location and date-range filters")
    void searchHonorsFilters() {
        // Type + location filter: only C1 is ECONOMY @Downtown.
        List<Car> ecoDowntown = rental.searchAvailableCars(CarType.ECONOMY, downtown, JUL_10_13);
        assertEquals(1, ecoDowntown.size());
        assertEquals("C1", ecoDowntown.get(0).getId());

        // Date filter: reserve C1, then it drops out of the overlapping search
        // but a non-overlapping window still finds it.
        rental.reserve("U1", "C1", JUL_10_13);
        assertTrue(rental.searchAvailableCars(CarType.ECONOMY, downtown, JUL_10_13).isEmpty());
        assertEquals(1, rental.searchAvailableCars(CarType.ECONOMY, downtown, JUL_13_15).size());

        // Maintenance cars are excluded regardless of dates.
        rental.setCarStatus("C4", CarStatus.MAINTENANCE);
        assertTrue(rental.searchAvailableCars(CarType.LUXURY, airport, JUL_10_13).isEmpty());
    }

    @Test
    @DisplayName("Pricing total equals daily rate x days")
    void pricingTotalCorrect() {
        // SUV @ $70 x 3 days = 210.
        assertEquals(0, new BigDecimal("210").compareTo(rental.quote("C3", JUL_10_13)));
        Reservation r = rental.reserve("U1", "C3", JUL_10_13);
        assertEquals(0, new BigDecimal("210").compareTo(r.getBaseCost()));
    }

    @Test
    @DisplayName("On-time return incurs no late fee")
    void onTimeReturnNoLateFee() {
        Reservation r = rental.reserve("U1", "C1", JUL_10_13);
        rental.pickUp(r.getId(), LocalDate.of(2026, 7, 10).atTime(9, 0));
        Charges c = rental.returnCar(r.getId(), LocalDate.of(2026, 7, 12).atTime(23, 0)); // before day 13

        assertEquals(ReservationStatus.RETURNED, r.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(c.getLateFee()));
        assertEquals(0, new BigDecimal("120").compareTo(c.getTotal()));
    }

    @Test
    @DisplayName("Late return adds a late fee per started late day")
    void lateReturnAddsLateFee() {
        Reservation r = rental.reserve("U1", "C1", JUL_10_13);
        rental.pickUp(r.getId(), LocalDate.of(2026, 7, 10).atTime(9, 0));
        // Due 2026-07-13 00:00; returned 2 hours late -> 1 started late day.
        Charges c = rental.returnCar(r.getId(), LocalDate.of(2026, 7, 13).atTime(2, 0));

        // late fee = $40 x 1.5 x 1 = 60; total = 120 + 60 = 180.
        assertEquals(0, new BigDecimal("60.0").compareTo(c.getLateFee()));
        assertEquals(0, new BigDecimal("180.0").compareTo(c.getTotal()));
    }

    @Test
    @DisplayName("Cannot return a car that was never picked up (State pattern)")
    void cannotReturnBeforePickup() {
        Reservation r = rental.reserve("U1", "C1", JUL_10_13);
        assertThrows(IllegalStateException.class,
                () -> rental.returnCar(r.getId(), LocalDate.of(2026, 7, 12).atTime(9, 0)));
    }

    @Test
    @DisplayName("Under a stampede, exactly one thread reserves the same car+window")
    void concurrentReservationsExactlyOneWins() throws InterruptedException {
        final int threads = 64;
        final ExecutorService pool = Executors.newFixedThreadPool(threads);
        final CountDownLatch ready = new CountDownLatch(threads);
        final CountDownLatch go = new CountDownLatch(1);
        final AtomicInteger wins = new AtomicInteger();
        final AtomicInteger losses = new AtomicInteger();

        for (int i = 0; i < threads; i++) {
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    ready.countDown();
                    try {
                        go.await();
                        rental.reserve("U1", "C1", JUL_10_13);
                        wins.incrementAndGet();
                    } catch (CarUnavailableException e) {
                        losses.incrementAndGet();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            });
        }

        assertTrue(ready.await(5, TimeUnit.SECONDS), "workers did not start in time");
        go.countDown(); // release the stampede
        pool.shutdown();
        assertTrue(pool.awaitTermination(10, TimeUnit.SECONDS), "reservations did not finish in time");

        assertEquals(1, wins.get(), "exactly one thread should win");
        assertEquals(threads - 1, losses.get(), "all other threads should lose");
    }
}
