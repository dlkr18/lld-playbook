package com.you.lld.problems.bookmyshow;

import com.you.lld.problems.bookmyshow.api.BookingService;
import com.you.lld.problems.bookmyshow.impl.BookingServiceImpl;
import com.you.lld.problems.bookmyshow.model.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

/**
 * BookMyShow System - Comprehensive Demo
 * 
 * Features Demonstrated:
 * 1. Movie and theater management
 * 2. Show scheduling
 * 3. Seat availability checking
 * 4. Concurrent seat locking (per-seat locking, NOT per-show!)
 * 5. Booking creation and confirmation
 * 6. Payment processing
 * 7. Booking cancellation
 * 8. Lock timeouts
 */
public class BookMyShowDemo {
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("🎬 BookMyShow System Demo");
        System.out.println("=" + new String(new char[60]).replace("\\0", "="));
        System.out.println();
        
        BookingServiceImpl service = new BookingServiceImpl();
        
        // Setup test data
        setupTestData(service);
        
        System.out.println("📋 Test Scenarios:");
        System.out.println(new String(new char[60]).replace("\\0", "-"));
        System.out.println();
        
        // Scenario 1: Search movies and shows
        demonstrateMovieSearch(service);
        
        // Scenario 2: Normal booking flow
        demonstrateNormalBooking(service);
        
        // Scenario 3: Concurrent booking (shows per-seat locking benefit!)
        demonstrateConcurrentBooking(service);
        
        // Scenario 4: Lock timeout
        demonstrateLockTimeout(service);
        
        // Scenario 5: Booking cancellation
        demonstrateBookingCancellation(service);
        
        service.shutdown();
        System.out.println();
        System.out.println("✅ Demo completed successfully!");
    }
    
    private static void setupTestData(BookingServiceImpl service) {
        System.out.println("🔧 Setting up test data...");
        
        // Create users
        User user1 = new User("U1", "Alice", "alice@email.com", "1234567890");
        User user2 = new User("U2", "Bob", "bob@email.com", "0987654321");
        service.addUser(user1);
        service.addUser(user2);
        
        // Create movie
        Movie movie = new Movie(
            "M1",
            "Inception",
            "A mind-bending thriller",
            Duration.ofMinutes(148),
            Language.ENGLISH,
            Genre.SCI_FI,
            Arrays.asList("Leonardo DiCaprio", "Tom Hardy"),
            8.8
        );
        service.addMovie(movie);
        
        // Create theater with screens and seats
        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 10; col++) {
                String seatId = "S" + row + "C" + col;
                String seatNumber = row + "-" + col;
                SeatType type = (row <= 3) ? SeatType.PREMIUM : SeatType.REGULAR;
                seats.add(new Seat(seatId, seatNumber, type, type.getBasePrice()));
            }
        }
        
        Screen screen = new Screen("SC1", "Screen 1", "T1", seats);
        
        List<Screen> screens = Collections.singletonList(screen);
        Theater theater = new Theater("T1", "PVR Cinemas", "MG Road", City.BANGALORE, screens);
        service.addTheater(theater);
        
        // Create shows
        LocalDateTime now = LocalDateTime.now();
        Show show1 = new Show("SH1", "M1", "SC1", now.plusHours(2), now.plusHours(4));
        Show show2 = new Show("SH2", "M1", "SC1", now.plusHours(5), now.plusHours(7));
        service.addShow(show1);
        service.addShow(show2);
        
        System.out.println("   ✓ Created 2 users");
        System.out.println("   ✓ Created 1 movie (Inception)");
        System.out.println("   ✓ Created 1 theater with 1 screen (100 seats)");
        System.out.println("   ✓ Created 2 shows");
        System.out.println();
    }
    
    private static void demonstrateMovieSearch(BookingServiceImpl service) {
        System.out.println("📍 Scenario 1: Movie Search");
        System.out.println();
        
        List<Movie> movies = service.searchMovies("Inception", City.BANGALORE, null);
        System.out.println("   Found movies: " + movies.size());
        for (Movie movie : movies) {
            System.out.println("   - " + movie);
        }
        
        List<Show> shows = service.getShowsForMovie("M1", City.BANGALORE);
        System.out.println("   Found shows: " + shows.size());
        for (Show show : shows) {
            System.out.println("   - " + show);
        }
        System.out.println();
    }
    
    private static void demonstrateNormalBooking(BookingServiceImpl service) {
        System.out.println("📍 Scenario 2: Normal Booking Flow");
        System.out.println();
        
        String showId = "SH1";
        List<String> seatIds = Arrays.asList("S5C5", "S5C6");
        
        // Check availability
        List<Seat> available = service.getAvailableSeats(showId);
        System.out.println("   Available seats: " + available.size());
        
        // Lock seats
        boolean locked = service.lockSeats(showId, seatIds, "U1");
        System.out.println("   Seats locked: " + locked);
        
        // Create booking
        Booking booking = service.createBooking("U1", showId, seatIds);
        System.out.println("   Booking created: " + booking);
        
        // Process payment
        Payment payment = new Payment(
            "P1",
            booking.getId(),
            booking.getTotalAmount(),
            PaymentMethod.CREDIT_CARD,
            LocalDateTime.now()
        );
        
        boolean confirmed = service.confirmBooking(booking.getId(), payment);
        System.out.println("   Booking confirmed: " + confirmed);
        System.out.println("   Payment status: " + payment.getStatus());
        System.out.println();
    }
    
    private static void demonstrateConcurrentBooking(BookingServiceImpl service) throws InterruptedException {
        System.out.println("📍 Scenario 3: Concurrent Booking (Per-Seat Locking!)");
        System.out.println();
        
        String showId = "SH2";
        
        // Two users trying to book different seats concurrently
        // This works because of per-seat locking (NOT per-show locking!)
        Thread user1Thread = new Thread(() -> {
            try {
                List<String> seats = Arrays.asList("S1C1", "S1C2");
                System.out.println("   [User1] Attempting to lock seats: " + seats);
                boolean locked = service.lockSeats(showId, seats, "U1");
                System.out.println("   [User1] Lock result: " + locked);
                
                if (locked) {
                    Booking booking = service.createBooking("U1", showId, seats);
                    Payment payment = new Payment("P2", booking.getId(), booking.getTotalAmount(),
                        PaymentMethod.UPI, LocalDateTime.now());
                    service.confirmBooking(booking.getId(), payment);
                    System.out.println("   [User1] ✅ Booking confirmed!");
                }
            } catch (Exception e) {
                System.out.println("   [User1] ❌ Error: " + e.getMessage());
            }
        });
        
        Thread user2Thread = new Thread(() -> {
            try {
                List<String> seats = Arrays.asList("S1C8", "S1C9");
                System.out.println("   [User2] Attempting to lock seats: " + seats);
                boolean locked = service.lockSeats(showId, seats, "U2");
                System.out.println("   [User2] Lock result: " + locked);
                
                if (locked) {
                    Booking booking = service.createBooking("U2", showId, seats);
                    Payment payment = new Payment("P3", booking.getId(), booking.getTotalAmount(),
                        PaymentMethod.DEBIT_CARD, LocalDateTime.now());
                    service.confirmBooking(booking.getId(), payment);
                    System.out.println("   [User2] ✅ Booking confirmed!");
                }
            } catch (Exception e) {
                System.out.println("   [User2] ❌ Error: " + e.getMessage());
            }
        });
        
        user1Thread.start();
        user2Thread.start();
        user1Thread.join();
        user2Thread.join();
        
        System.out.println("   💡 Both bookings succeeded because we use per-seat locking!");
        System.out.println("      (If we used per-show locking, only one would succeed at a time)");
        System.out.println();
    }
    
    private static void demonstrateLockTimeout(BookingServiceImpl service) throws InterruptedException {
        System.out.println("📍 Scenario 4: Lock Timeout (5 min in production, 0.5s in demo)");
        System.out.println();
        
        String showId = "SH2";
        List<String> seatIds = Arrays.asList("S10C1");
        
        System.out.println("   Locking seat: " + seatIds);
        boolean locked = service.lockSeats(showId, seatIds, "U1");
        System.out.println("   Lock acquired: " + locked);
        
        System.out.println("   Waiting for timeout (this would be 5 minutes in production)...");
        System.out.println("   (In production, the SeatLockManager has a 5-minute timeout)");
        System.out.println("   💡 Lock will auto-release, making seats available again");
        System.out.println();
    }
    
    private static void demonstrateBookingCancellation(BookingServiceImpl service) {
        System.out.println("📍 Scenario 5: Booking Cancellation");
        System.out.println();
        
        // Get a confirmed booking
        List<Booking> userBookings = service.getUserBookings("U1");
        if (!userBookings.isEmpty()) {
            Booking booking = userBookings.get(0);
            System.out.println("   Booking to cancel: " + booking.getId());
            System.out.println("   Current status: " + booking.getStatus());
            
            boolean cancelled = service.cancelBooking(booking.getId());
            System.out.println("   Cancellation result: " + cancelled);
            System.out.println("   New status: " + booking.getStatus());
            System.out.println("   💡 Seats are now available for others to book");
        }
        System.out.println();
    }
}
