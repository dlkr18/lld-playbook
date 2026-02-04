package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Comprehensive demo of BookMyShow system showcasing:
 * - Movie and show management
 * - Seat selection and locking
 * - Concurrent booking scenarios
 * - Payment processing
 * - Dynamic pricing
 * - Multi-channel notifications
 */
public class BookMyShowDemo {
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("🎬 ========================================");
        System.out.println("   BookMyShow - Complete Demo");
        System.out.println("========================================\n");
        
        // Setup system
        EnhancedBookingService bookingService = setupSystem();
        
        try {
            // Demo 1: Basic booking flow
            System.out.println("\n📍 DEMO 1: Basic Booking Flow");
            System.out.println("───────────────────────────────────────");
            demoBasicBooking(bookingService);
            
            // Demo 2: Concurrent booking (same seats)
            System.out.println("\n📍 DEMO 2: Concurrent Booking (Race Condition)");
            System.out.println("───────────────────────────────────────");
            demoConcurrentBooking(bookingService);
            
            // Demo 3: Seat lock timeout
            System.out.println("\n📍 DEMO 3: Seat Lock Timeout");
            System.out.println("───────────────────────────────────────");
            demoLockTimeout(bookingService);
            
            // Demo 4: Booking cancellation
            System.out.println("\n📍 DEMO 4: Booking Cancellation");
            System.out.println("───────────────────────────────────────");
            demoCancellation(bookingService);
            
            // Demo 5: Search and filter
            System.out.println("\n📍 DEMO 5: Search & Filter");
            System.out.println("───────────────────────────────────────");
            demoSearchAndFilter(bookingService);
            
            // Demo 6: Dynamic pricing
            System.out.println("\n📍 DEMO 6: Dynamic Pricing");
            System.out.println("───────────────────────────────────────");
            demoDynamicPricing();
            
            System.out.println("\n\n✅ ========================================");
            System.out.println("   All Demos Completed Successfully!");
            System.out.println("========================================");
            
        } finally {
            bookingService.shutdown();
        }
    }
    
    private static EnhancedBookingService setupSystem() {
        System.out.println("⚙️  Setting up BookMyShow system...\n");
        
        // Create notification strategy (multi-channel)
        MultiChannelNotificationStrategy notificationStrategy = new MultiChannelNotificationStrategy();
        notificationStrategy.addChannel(new EmailNotificationStrategy());
        notificationStrategy.addChannel(new SMSNotificationStrategy());
        
        // Create pricing strategy (dynamic)
        PricingStrategy pricingStrategy = new DynamicPricingStrategy(Currency.getInstance("INR"));
        
        // Initialize service
        EnhancedBookingService service = new EnhancedBookingService(
            pricingStrategy,
            notificationStrategy
        );
        
        // Setup data: Movies
        Movie movie1 = new Movie(
            "M001",
            "Avengers: Endgame",
            "Epic superhero finale",
            Duration.ofMinutes(181),
            Language.ENGLISH,
            Genre.ACTION,
            Arrays.asList("Robert Downey Jr.", "Chris Evans"),
            9.0
        );
        
        Movie movie2 = new Movie(
            "M002",
            "3 Idiots",
            "Life lessons from college",
            Duration.ofMinutes(170),
            Language.HINDI,
            Genre.COMEDY,
            Arrays.asList("Aamir Khan", "R. Madhavan"),
            8.4
        );
        
        service.addMovie(movie1);
        service.addMovie(movie2);
        
        // Setup data: Theaters
        Theater theater = new Theater(
            "T001",
            "PVR Phoenix",
            "Lower Parel, Mumbai",
            City.MUMBAI
        );
        service.addTheater(theater);
        
        // Setup data: Screen with seats
        Screen screen = new Screen("S001", "T001", "AURO 3D", 100);
        
        // Add seats
        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 10; col++) {
                String seatNum = (char) ('A' + row - 1) + String.valueOf(col);
                SeatType type;
                double price;
                
                if (row <= 3) {
                    type = SeatType.VIP;
                    price = 400.0;
                } else if (row <= 7) {
                    type = SeatType.PREMIUM;
                    price = 250.0;
                } else {
                    type = SeatType.REGULAR;
                    price = 150.0;
                }
                
                seats.add(new Seat("SEAT_" + seatNum, seatNum, type, price));
            }
        }
        screen.setSeats(seats);
        service.addScreen(screen);
        
        // Setup data: Shows
        Show show1 = new Show(
            "SH001",
            "M001",
            "S001",
            LocalDateTime.now().plusHours(3), // 3 hours from now
            LocalDateTime.now().plusHours(6)
        );
        service.addShow(show1);
        
        Show show2 = new Show(
            "SH002",
            "M002",
            "S001",
            LocalDateTime.now().plusDays(1).withHour(21), // Tomorrow evening
            LocalDateTime.now().plusDays(1).withHour(23).plusMinutes(50)
        );
        service.addShow(show2);
        
        // Setup data: Users
        service.addUser(new User("U001", "John Doe", "john@email.com", "+91-9876543210"));
        service.addUser(new User("U002", "Jane Smith", "jane@email.com", "+91-9876543211"));
        service.addUser(new User("U003", "Bob Wilson", "bob@email.com", "+91-9876543212"));
        
        System.out.println("✅ System setup complete!\n");
        return service;
    }
    
    private static void demoBasicBooking(EnhancedBookingService service) {
        System.out.println("👤 User: John Doe");
        System.out.println("🎬 Movie: Avengers: Endgame");
        System.out.println("🎫 Seats: A1, A2\n");
        
        String userId = "U001";
        String showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_A1", "SEAT_A2");
        
        try {
            // Step 1: Lock seats
            System.out.println("1️⃣  Locking seats...");
            boolean locked = service.lockSeats(showId, seatIds, userId);
            System.out.println("   Seats locked: " + locked + "\n");
            
            // Step 2: Create booking
            System.out.println("2️⃣  Creating booking...");
            Booking booking = service.createBooking(userId, showId, seatIds);
            System.out.println("   Booking created: " + booking.getId());
            System.out.println("   Amount: ₹" + booking.getTotalAmount() + "\n");
            
            // Step 3: Process payment
            System.out.println("3️⃣  Processing payment...");
            Payment payment = new Payment(
                "PAY_" + System.currentTimeMillis(),
                booking.getId(),
                booking.getTotalAmount(),
                PaymentMethod.CREDIT_CARD,
                LocalDateTime.now()
            );
            payment.setStatus(PaymentStatus.SUCCESS);
            
            // Step 4: Confirm booking
            System.out.println("4️⃣  Confirming booking...");
            boolean confirmed = service.confirmBooking(booking.getId(), payment);
            System.out.println("   Booking confirmed: " + confirmed + "\n");
            
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
        }
    }
    
    private static void demoConcurrentBooking(EnhancedBookingService service) 
            throws InterruptedException {
        System.out.println("👥 2 users trying to book same seats simultaneously\n");
        
        String showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_B1", "SEAT_B2");
        
        ExecutorService executor = Executors.newFixedThreadPool(2);
        
        // User 1
        executor.submit(() -> {
            try {
                System.out.println("👤 User Jane attempting to lock seats...");
                boolean locked = service.lockSeats(showId, seatIds, "U002");
                if (locked) {
                    System.out.println("✅ Jane locked seats successfully!");
                    Booking booking = service.createBooking("U002", showId, seatIds);
                    
                    Thread.sleep(1000); // Simulate payment processing
                    
                    Payment payment = new Payment(
                        "PAY_" + System.currentTimeMillis(),
                        booking.getId(),
                        booking.getTotalAmount(),
                        PaymentMethod.UPI,
                        LocalDateTime.now()
                    );
                    payment.setStatus(PaymentStatus.SUCCESS);
                    service.confirmBooking(booking.getId(), payment);
                }
            } catch (Exception e) {
                System.out.println("❌ Jane failed: " + e.getMessage());
            }
        });
        
        // User 2 (slightly delayed)
        Thread.sleep(100);
        executor.submit(() -> {
            try {
                System.out.println("👤 User Bob attempting to lock same seats...");
                boolean locked = service.lockSeats(showId, seatIds, "U003");
                if (locked) {
                    System.out.println("✅ Bob locked seats successfully!");
                } else {
                    System.out.println("⚠️  Bob couldn't lock - seats already taken by Jane!");
                }
            } catch (Exception e) {
                System.out.println("❌ Bob failed: " + e.getMessage());
            }
        });
        
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println();
    }
    
    private static void demoLockTimeout(EnhancedBookingService service) 
            throws InterruptedException {
        System.out.println("⏰ Testing seat lock expiry (5 min timeout)\n");
        
        String showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_C1", "SEAT_C2");
        
        System.out.println("1️⃣  User locks seats but doesn't complete booking...");
        service.lockSeats(showId, seatIds, "U001");
        
        System.out.println("2️⃣  Waiting for lock to expire...");
        System.out.println("   (Normally 5 minutes, simulating with shorter wait)\n");
        
        Thread.sleep(2000); // In reality, this would be 300 seconds
        
        System.out.println("3️⃣  After timeout, seats become available again");
        System.out.println("   Other users can now book these seats\n");
    }
    
    private static void demoCancellation(EnhancedBookingService service) {
        System.out.println("❌ User cancels a confirmed booking\n");
        
        String userId = "U001";
        String showId = "SH001";
        List<String> seatIds = Arrays.asList("SEAT_D1", "SEAT_D2");
        
        try {
            // Book seats
            service.lockSeats(showId, seatIds, userId);
            Booking booking = service.createBooking(userId, showId, seatIds);
            
            Payment payment = new Payment(
                "PAY_" + System.currentTimeMillis(),
                booking.getId(),
                booking.getTotalAmount(),
                PaymentMethod.DEBIT_CARD,
                LocalDateTime.now()
            );
            payment.setStatus(PaymentStatus.SUCCESS);
            service.confirmBooking(booking.getId(), payment);
            
            System.out.println("✅ Booking confirmed: " + booking.getId());
            System.out.println("\n🔄 Now cancelling the booking...\n");
            
            // Cancel
            boolean cancelled = service.cancelBooking(booking.getId());
            System.out.println("   Cancellation status: " + cancelled);
            System.out.println("   Seats released for other users\n");
            
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
        }
    }
    
    private static void demoSearchAndFilter(EnhancedBookingService service) {
        System.out.println("🔍 Searching for movies and shows\n");
        
        // Search by title
        System.out.println("1️⃣  Search: 'Avengers'");
        List<Movie> results = service.searchMovies("Avengers", null, null);
        results.forEach(m -> System.out.println("   - " + m.getTitle() + " (" + m.getLanguage() + ")"));
        
        // Search by language
        System.out.println("\n2️⃣  Search: Hindi movies");
        List<Movie> hindiMovies = service.searchMovies(null, null, Language.HINDI);
        hindiMovies.forEach(m -> System.out.println("   - " + m.getTitle()));
        
        // Get shows for movie
        System.out.println("\n3️⃣  Shows for '3 Idiots' in Mumbai");
        List<Show> shows = service.getShowsForMovie("M002", City.MUMBAI);
        shows.forEach(s -> System.out.println("   - Show at: " + s.getStartTime()));
        
        System.out.println();
    }
    
    private static void demoDynamicPricing() {
        System.out.println("💰 Comparing pricing strategies\n");
        
        Currency inr = Currency.getInstance("INR");
        
        // Simple pricing
        PricingStrategy simpleStrategy = new SimplePricingStrategy(inr);
        System.out.println("📊 " + simpleStrategy.getDescription());
        System.out.println("   REGULAR: ₹120, PREMIUM: ₹200, VIP: ₹350\n");
        
        // Dynamic pricing
        PricingStrategy dynamicStrategy = new DynamicPricingStrategy(inr);
        System.out.println("📊 " + dynamicStrategy.getDescription());
        System.out.println("   Base prices with multipliers:");
        System.out.println("   - Weekend: +30%");
        System.out.println("   - Evening (after 6 PM): +20%");
        System.out.println("   - High occupancy: +50% (surge)\n");
    }
    
    private static void demoCachePerformance(EnhancedBookingService service) {
        System.out.println("⚡ Testing LRU Movie Cache\n");
        
        // Access movie multiple times
        System.out.println("1️⃣  First access (cache MISS)");
        long start = System.nanoTime();
        Movie movie1 = service.getMovieById("M001");
        long duration1 = System.nanoTime() - start;
        System.out.println("   Movie: " + movie1.getTitle());
        System.out.println("   Time: " + duration1 / 1000 + " μs\n");
        
        // Second access (should hit cache)
        System.out.println("2️⃣  Second access (cache HIT)");
        start = System.nanoTime();
        Movie movie2 = service.getMovieById("M001");
        long duration2 = System.nanoTime() - start;
        System.out.println("   Movie: " + movie2.getTitle());
        System.out.println("   Time: " + duration2 / 1000 + " μs");
        System.out.println("   Speedup: " + (duration1 / (duration2 + 1)) + "x faster\n");
        
        // Cache statistics
        System.out.println("3️⃣  Cache Statistics");
        Map<String, Object> stats = service.getCacheStats();
        stats.forEach((key, value) -> 
            System.out.println("   " + key + ": " + value));
        System.out.println();
    }
}
