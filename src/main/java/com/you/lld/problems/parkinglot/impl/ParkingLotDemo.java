package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.api.ParkingTicketResult;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidTicketException;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidVehicleException;
import com.you.lld.problems.parkinglot.api.exceptions.ParkingFullException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentFailedException;
import com.you.lld.problems.parkinglot.model.Floor;
import com.you.lld.problems.parkinglot.model.OccupancyReport;
import com.you.lld.problems.parkinglot.model.ParkingLot;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * End-to-end demo covering every feature of the overhauled parking lot:
 *   1. Lot composite (Lot -> Floor -> Space) construction
 *   2. Strategy plug-in (Hourly pricing, Nearest allocation)
 *   3. Observer (LoggingEventListener)
 *   4. Regular + disabled-permit entry with correct allocation
 *   5. Swappable strategies (switch to FirstAvailable + FlatRate mid-demo)
 *   6. Exit + payment flow with all payment methods
 *   7. Error handling (already-parked, invalid ticket, full lot)
 *   8. Concurrent entries hitting CAS allocation
 */
public class ParkingLotDemo {

    public static void main(String[] args) throws Exception {
        header("Parking Lot — full demo");

        // ── Scenario 1: build the lot composite ─────────────────────────────
        header("1. Build ParkingLot -> Floor -> Space");
        ParkingLot lot = buildSmallLot();
        System.out.println("   lot '" + lot.getName() + "' has " + lot.getFloors().size()
            + " floors, " + lot.totalSpaces() + " spaces total");

        // ── Scenario 2: service with Hourly + Nearest ───────────────────────
        header("2. Wire service with Hourly pricing + Nearest allocation");
        HourlyPricingStrategy hourly = new HourlyPricingStrategy();
        NearestSpaceAllocationStrategy nearest = new NearestSpaceAllocationStrategy();
        SimplePaymentProcessor payments = new SimplePaymentProcessor();

        ParkingService service = new InMemoryParkingService(lot, hourly, nearest, payments);
        service.addEventListener(new LoggingEventListener());
        System.out.println("   pricing:    " + hourly.getDescription());
        System.out.println("   allocation: " + nearest.getDescription());

        reportOccupancy(service.getOccupancyReport());

        // ── Scenario 3: park a mix of vehicles ──────────────────────────────
        header("3. Park vehicles of each type");
        Vehicle bike   = new Vehicle("KA-01-MC-1", VehicleType.MOTORCYCLE);
        Vehicle car    = new Vehicle("KA-02-CR-1", VehicleType.CAR);
        Vehicle suv    = new Vehicle("KA-02-CR-2", VehicleType.CAR);
        Vehicle truck  = new Vehicle("KA-03-TR-1", VehicleType.TRUCK);
        Vehicle access = new Vehicle("KA-04-DS-1", VehicleType.CAR, true);

        ParkingTicketResult t1 = service.enterVehicle(bike);
        ParkingTicketResult t2 = service.enterVehicle(car);
        ParkingTicketResult t3 = service.enterVehicle(access);
        ParkingTicketResult t4 = service.enterVehicle(truck);
        ParkingTicketResult t5 = service.enterVehicle(suv);

        System.out.println();
        System.out.println("   assigned spaces:");
        System.out.println("     bike   -> " + t1.getSpaceId());
        System.out.println("     car    -> " + t2.getSpaceId());
        System.out.println("     access -> " + t3.getSpaceId() + "  (disabled permit; should land in a DISABLED space)");
        System.out.println("     truck  -> " + t4.getSpaceId() + "  (only LARGE compatible)");
        System.out.println("     suv    -> " + t5.getSpaceId());
        reportOccupancy(service.getOccupancyReport());

        // ── Scenario 4: fee preview ────────────────────────────────────────
        header("4. Fee preview (grace period is 15m; short stays are free)");
        System.out.println("   bike  fee preview: " + service.calculateParkingFee(t1.getTicketId()));
        System.out.println("   car   fee preview: " + service.calculateParkingFee(t2.getTicketId()));
        System.out.println("   truck fee preview: " + service.calculateParkingFee(t4.getTicketId()));

        // ── Scenario 5: exit + different payment methods ────────────────────
        header("5. Exit vehicles with different payment methods");
        Payment p1 = service.exitVehicle(t1.getTicketId(), PaymentMethod.MOBILE_PAYMENT);
        Payment p2 = service.exitVehicle(t2.getTicketId(), PaymentMethod.CREDIT_CARD);
        Payment p3 = service.exitVehicle(t3.getTicketId(), PaymentMethod.DEBIT_CARD);
        System.out.println();
        System.out.println("   payments issued: " + p1.getPaymentId() + ", " + p2.getPaymentId() + ", " + p3.getPaymentId());

        // ── Scenario 6: swap in FlatRate + FirstAvailable strategies ────────
        header("6. Swap to FlatRate pricing + FirstAvailable allocation on a fresh lot");
        Map<VehicleType, Money> dailyRates = new HashMap<>();
        Currency usd = Currency.getInstance("USD");
        dailyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("8.00"),  usd));
        dailyRates.put(VehicleType.CAR,        Money.of(new BigDecimal("15.00"), usd));
        dailyRates.put(VehicleType.TRUCK,      Money.of(new BigDecimal("25.00"), usd));
        dailyRates.put(VehicleType.BUS,        Money.of(new BigDecimal("35.00"), usd));

        ParkingLot lot2 = buildSmallLot();
        ParkingService alt = new InMemoryParkingService(
            lot2,
            new FlatRatePricingStrategy(dailyRates),
            new FirstAvailableAllocationStrategy(),
            new SimplePaymentProcessor()
        );
        alt.addEventListener(new LoggingEventListener());

        ParkingTicketResult at = alt.enterVehicle(new Vehicle("TN-07-FL-1", VehicleType.CAR));
        System.out.println("   flat-rate fee preview: " + alt.calculateParkingFee(at.getTicketId()));
        alt.exitVehicle(at.getTicketId(), PaymentMethod.CASH);

        // ── Scenario 7: error handling ──────────────────────────────────────
        header("7. Error handling");
        safe("already-parked",  () -> service.enterVehicle(truck));
        safe("invalid ticket",  () -> service.exitVehicle("BOGUS-ID", PaymentMethod.CASH));
        safe("bad vehicle",     () -> service.enterVehicle(new Vehicle("   ", VehicleType.CAR)));

        header("8. Fill until full, then prove ParkingFullException fires");
        fillUntilFull(service);

        // ── Scenario 9: concurrent entries ──────────────────────────────────
        header("9. Concurrent entries (CAS allocation)");
        concurrentEntries();

        System.out.println();
        System.out.println("=== demo complete ===");
    }

    private static ParkingLot buildSmallLot() {
        List<Floor> floors = new ArrayList<>();
        floors.add(floor(0, 2, 3, 1, 1));
        floors.add(floor(1, 1, 4, 2, 0));
        floors.add(floor(2, 1, 2, 1, 0));
        return new ParkingLot("LOT-001", "Airport Terminal 1", floors);
    }

    private static Floor floor(int num, int motos, int compacts, int larges, int disableds) {
        List<ParkingSpace> s = new ArrayList<>();
        for (int i = 1; i <= motos;     i++) s.add(new ParkingSpace("F" + num + "-MC-" + i, SpaceType.MOTORCYCLE, num));
        for (int i = 1; i <= compacts;  i++) s.add(new ParkingSpace("F" + num + "-C-"  + i, SpaceType.COMPACT,    num));
        for (int i = 1; i <= larges;    i++) s.add(new ParkingSpace("F" + num + "-L-"  + i, SpaceType.LARGE,      num));
        for (int i = 1; i <= disableds; i++) s.add(new ParkingSpace("F" + num + "-D-"  + i, SpaceType.DISABLED,   num));
        return new Floor(num, s);
    }

    private static void reportOccupancy(OccupancyReport r) {
        System.out.println();
        System.out.println("   occupancy: " + r.getOccupiedSpaces() + "/" + r.getTotalSpaces()
            + "  (" + String.format("%.0f%%", r.getOccupancyRate() * 100) + " full)");
        for (SpaceType t : SpaceType.values()) {
            int avail = r.getAvailableSpaces(t);
            int occ   = r.getOccupiedSpaces(t);
            if (avail + occ > 0) {
                System.out.println("     " + t + ": " + occ + " occupied / " + (avail + occ) + " total");
            }
        }
    }

    private static void fillUntilFull(ParkingService service) {
        int n = 0;
        while (true) {
            try {
                Vehicle v = new Vehicle("FILL-" + n, VehicleType.CAR);
                service.enterVehicle(v);
                n++;
            } catch (ParkingFullException e) {
                System.out.println("   filled " + n + " additional cars, then: " + e.getMessage());
                return;
            } catch (InvalidVehicleException e) {
                n++;
            }
        }
    }

    private static void concurrentEntries() throws InterruptedException {
        ParkingLot lot = buildSmallLot();
        ParkingService svc = new InMemoryParkingService(
            lot,
            new HourlyPricingStrategy(),
            new NearestSpaceAllocationStrategy(),
            new SimplePaymentProcessor()
        );

        int threads = 20;
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done  = new CountDownLatch(threads);
        AtomicInteger parked = new AtomicInteger();
        AtomicInteger full   = new AtomicInteger();

        for (int i = 0; i < threads; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    start.await();
                    svc.enterVehicle(new Vehicle("CON-" + id, VehicleType.CAR));
                    parked.incrementAndGet();
                } catch (ParkingFullException e) {
                    full.incrementAndGet();
                } catch (Exception ignored) {
                } finally {
                    done.countDown();
                }
            }, "entry-" + id).start();
        }

        start.countDown();
        done.await();
        System.out.println("   launched " + threads + " threads: parked=" + parked.get()
            + " rejected=" + full.get());
        System.out.println("   lot occupancy now: " + svc.getOccupancyReport().getOccupiedSpaces()
            + "/" + svc.getOccupancyReport().getTotalSpaces());
        System.out.println("   (parked count should exactly equal occupied count)");
    }

    private static void header(String msg) {
        System.out.println();
        System.out.println("── " + msg + " ──");
    }

    @FunctionalInterface
    private interface ThrowingRunnable { void run() throws Exception; }

    private static void safe(String label, ThrowingRunnable r) {
        try {
            r.run();
            System.out.println("   " + label + ": (no exception — unexpected)");
        } catch (ParkingFullException | InvalidTicketException | InvalidVehicleException | PaymentFailedException e) {
            System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage());
        } catch (Exception e) {
            System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
