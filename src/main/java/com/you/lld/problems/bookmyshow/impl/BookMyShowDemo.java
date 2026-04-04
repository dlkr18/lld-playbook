package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * End-to-end demo of BookMyShow exercising every pattern:
 *
 *   1. Strategy   -- SimplePricingStrategy vs DynamicPricingStrategy
 *   2. Composite  -- MultiChannelNotificationStrategy (Email + SMS)
 *   3. State      -- Booking lifecycle: Pending -> Confirmed / Cancelled / Expired
 *   4. Observer   -- BookingNotifier fires on state change (SRP, not in entity)
 *   5. Concurrency-- SeatLockManager fine-grained per-seat locks with rollback
 *   6. Cache      -- MovieCache LRU + TTL
 */
public class BookMyShowDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========================================");
        System.out.println("  BookMyShow -- Full LLD Demo");
        System.out.println("========================================\n");

        EnhancedBookingService service = setupSystem();

        try {
            demoBasicBookingFlow(service);
            demoConcurrentSeatRace(service);
            demoCancellation(service);
            demoExpiredBookingRejected(service);
            demoSearchAndFilter(service);
            demoPricingStrategies();
            demoCacheHitMiss(service);
        } finally {
            service.shutdown();
        }

        System.out.println("\n========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────────────────── Setup ────────────────────────

    private static EnhancedBookingService setupSystem() {
        System.out.println("[Setup] Initializing system...\n");

        MultiChannelNotificationStrategy notification = new MultiChannelNotificationStrategy();
        notification.addChannel(new EmailNotificationStrategy());
        notification.addChannel(new SMSNotificationStrategy());

        PricingStrategy pricing = new DynamicPricingStrategy(Currency.getInstance("INR"));

        EnhancedBookingService service = new EnhancedBookingService(pricing, notification);

        // Movies
        service.addMovie(new Movie("M001", "Avengers: Endgame", "Epic superhero finale",
            Duration.ofMinutes(181), Language.ENGLISH, Genre.ACTION,
            Arrays.asList("Robert Downey Jr.", "Chris Evans"), 9.0));
        service.addMovie(new Movie("M002", "3 Idiots", "Life lessons from college",
            Duration.ofMinutes(170), Language.HINDI, Genre.COMEDY,
            Arrays.asList("Aamir Khan", "R. Madhavan"), 8.4));

        // Theater + Screen
        service.addTheater(new Theater("T001", "PVR Phoenix", "Lower Parel, Mumbai", City.MUMBAI));

        Screen screen = new Screen("S001", "T001", "AURO 3D", 100);
        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 10; col++) {
                String seatNum = (char) ('A' + row - 1) + String.valueOf(col);
                SeatType type = row <= 3 ? SeatType.VIP
                              : row <= 7 ? SeatType.PREMIUM
                              : SeatType.REGULAR;
                double price = type == SeatType.VIP ? 400.0
                             : type == SeatType.PREMIUM ? 250.0 : 150.0;
                seats.add(new Seat("SEAT_" + seatNum, seatNum, type, price));
            }
        }
        screen.setSeats(seats);
        service.addScreen(screen);

        // Shows
        service.addShow(new Show("SH001", "M001", "S001",
            LocalDateTime.now().plusHours(3), LocalDateTime.now().plusHours(6)));
        service.addShow(new Show("SH002", "M002", "S001",
            LocalDateTime.now().plusDays(1).withHour(21),
            LocalDateTime.now().plusDays(1).withHour(23).plusMinutes(50)));

        // Users
        service.addUser(new User("U001", "John Doe", "john@email.com", "+91-9876543210"));
        service.addUser(new User("U002", "Jane Smith", "jane@email.com", "+91-9876543211"));
        service.addUser(new User("U003", "Bob Wilson", "bob@email.com", "+91-9876543212"));

        System.out.println("[Setup] Complete.\n");
        return service;
    }

    // ──────────────── Demo 1: Happy-path booking ────────────────

    private static void demoBasicBookingFlow(EnhancedBookingService service) {
        System.out.println("--- Demo 1: Basic Booking Flow (State: Pending -> Confirmed) ---");
        System.out.println("User: John | Movie: Avengers | Seats: A1, A2 (VIP)\n");

        String userId = "U001", showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_A1", "SEAT_A2");

        try {
            // 1. Lock seats
            boolean locked = service.lockSeats(showId, seatIds, userId);
            System.out.println("Step 1 - Lock seats: " + locked);

            // 2. Create booking (verifies user holds the locks)
            Booking booking = service.createBooking(userId, showId, seatIds);
            System.out.println("Step 2 - Booking created: " + booking);

            // 3. Simulate successful payment
            Payment payment = new Payment("PAY_" + System.currentTimeMillis(),
                booking.getId(), booking.getTotalAmount(),
                PaymentMethod.CREDIT_CARD, LocalDateTime.now());
            payment.setStatus(PaymentStatus.SUCCESS);

            // 4. Confirm (State: Pending -> Confirmed, Observer fires notification)
            service.confirmBooking(booking.getId(), payment);
            System.out.println("Step 4 - Final status: " + booking.getStatus());

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────────── Demo 2: Concurrent seat race ────────────────

    private static void demoConcurrentSeatRace(EnhancedBookingService service)
            throws InterruptedException {
        System.out.println("--- Demo 2: Concurrent Seat Race ---");
        System.out.println("Jane and Bob both try to lock B1, B2 simultaneously.\n");

        String showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_B1", "SEAT_B2");

        ExecutorService exec = Executors.newFixedThreadPool(2);

        exec.submit(() -> {
            try {
                boolean ok = service.lockSeats(showId, seatIds, "U002");
                System.out.println("  Jane lock result: " + ok);
                if (ok) {
                    Booking b = service.createBooking("U002", showId, seatIds);
                    Payment p = new Payment("PAY_J", b.getId(), b.getTotalAmount(),
                        PaymentMethod.UPI, LocalDateTime.now());
                    p.setStatus(PaymentStatus.SUCCESS);
                    service.confirmBooking(b.getId(), p);
                    System.out.println("  Jane confirmed: " + b.getId());
                }
            } catch (Exception e) {
                System.out.println("  Jane failed: " + e.getMessage());
            }
        });

        Thread.sleep(50);

        exec.submit(() -> {
            try {
                boolean ok = service.lockSeats(showId, seatIds, "U003");
                System.out.println("  Bob lock result: " + ok);
            } catch (Exception e) {
                System.out.println("  Bob failed: " + e.getMessage());
            }
        });

        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println();
    }

    // ──────────────── Demo 3: Cancellation ────────────────

    private static void demoCancellation(EnhancedBookingService service) {
        System.out.println("--- Demo 3: Cancellation (State: Confirmed -> Cancelled) ---\n");

        String userId = "U001", showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_D1", "SEAT_D2");

        try {
            service.lockSeats(showId, seatIds, userId);
            Booking booking = service.createBooking(userId, showId, seatIds);

            Payment p = new Payment("PAY_C", booking.getId(), booking.getTotalAmount(),
                PaymentMethod.DEBIT_CARD, LocalDateTime.now());
            p.setStatus(PaymentStatus.SUCCESS);
            service.confirmBooking(booking.getId(), p);

            System.out.println("Before cancel: " + booking.getStatus());
            // State: Confirmed -> Cancelled (Observer fires cancellation notification)
            service.cancelBooking(booking.getId());
            System.out.println("After cancel:  " + booking.getStatus());

            // Verify seats are released
            boolean d1Free = service.getAvailableSeats(showId).stream()
                .anyMatch(s -> s.getId().equals("SEAT_D1"));
            System.out.println("Seat D1 available again: " + d1Free);

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────────── Demo 4: Expired booking rejection ────────────────

    private static void demoExpiredBookingRejected(EnhancedBookingService service) {
        System.out.println("--- Demo 4: State pattern guards ---");
        System.out.println("Attempting double-confirm and confirm-after-cancel.\n");

        String userId = "U001", showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_E1", "SEAT_E2");

        try {
            service.lockSeats(showId, seatIds, userId);
            Booking booking = service.createBooking(userId, showId, seatIds);

            Payment p = new Payment("PAY_E", booking.getId(), booking.getTotalAmount(),
                PaymentMethod.UPI, LocalDateTime.now());
            p.setStatus(PaymentStatus.SUCCESS);
            service.confirmBooking(booking.getId(), p);

            // Try to confirm again -- State pattern rejects
            try {
                service.confirmBooking(booking.getId(), p);
            } catch (IllegalStateException e) {
                System.out.println("Double-confirm blocked: " + e.getMessage());
            }

            service.cancelBooking(booking.getId());

            // Try to cancel again -- State pattern rejects
            try {
                service.cancelBooking(booking.getId());
            } catch (IllegalStateException e) {
                System.out.println("Cancel-after-cancel blocked: " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────────── Demo 5: Search & filter ────────────────

    private static void demoSearchAndFilter(EnhancedBookingService service) {
        System.out.println("--- Demo 5: Search & Filter ---\n");

        System.out.println("Search 'Avengers':");
        service.searchMovies("Avengers", null, null)
            .forEach(m -> System.out.println("  - " + m.getTitle() + " (" + m.getLanguage() + ")"));

        System.out.println("Hindi movies:");
        service.searchMovies(null, null, Language.HINDI)
            .forEach(m -> System.out.println("  - " + m.getTitle()));

        System.out.println("Shows for 3 Idiots in Mumbai:");
        service.getShowsForMovie("M002", City.MUMBAI)
            .forEach(s -> System.out.println("  - " + s.getStartTime()));

        System.out.println();
    }

    // ──────────────── Demo 6: Pricing strategies ────────────────

    private static void demoPricingStrategies() {
        System.out.println("--- Demo 6: Pricing Strategies ---\n");

        Currency inr = Currency.getInstance("INR");

        PricingStrategy simple = new SimplePricingStrategy(inr);
        PricingStrategy dynamic = new DynamicPricingStrategy(inr);

        Show futureShow = new Show("X", "X", "X",
            LocalDateTime.now().plusHours(3), LocalDateTime.now().plusHours(6));

        List<Seat> testSeats = Arrays.asList(
            new Seat("T1", "A1", SeatType.VIP, 400),
            new Seat("T2", "D1", SeatType.PREMIUM, 250)
        );

        System.out.println(simple.getDescription() + ": " + simple.calculatePrice(futureShow, testSeats));
        System.out.println(dynamic.getDescription() + ": " + dynamic.calculatePrice(futureShow, testSeats));
        System.out.println();
    }

    // ──────────────── Demo 7: Cache hit/miss ────────────────

    private static void demoCacheHitMiss(EnhancedBookingService service) {
        System.out.println("--- Demo 7: Movie Cache (LRU + TTL) ---\n");

        long t0 = System.nanoTime();
        Movie m1 = service.getMovieById("M001");
        long d1 = System.nanoTime() - t0;
        System.out.println("First access : " + m1.getTitle() + " (" + d1 / 1000 + " us)");

        long t1 = System.nanoTime();
        Movie m2 = service.getMovieById("M001");
        long d2 = System.nanoTime() - t1;
        System.out.println("Second access: " + m2.getTitle() + " (" + d2 / 1000 + " us)");

        System.out.println("Cache stats: " + service.getCacheStats());
        System.out.println();
    }
}
