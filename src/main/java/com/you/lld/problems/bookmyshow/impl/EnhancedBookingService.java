package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.api.BookingService;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.cache.MovieCache;
import com.you.lld.problems.bookmyshow.model.*;
import com.you.lld.problems.bookmyshow.exceptions.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Enhanced BookMyShow implementation with:
 * - Money type for proper currency handling
 * - Pluggable pricing strategies
 * - Notification strategies
 * - Movie caching (LRU with TTL)
 * - Thread-safe operations
 * - Transaction-like booking confirmation
 */
public class EnhancedBookingService implements BookingService {
    
    // Data stores - Thread-safe
    private final Map<String, Movie> movies = new ConcurrentHashMap<>();
    private final Map<String, Theater> theaters = new ConcurrentHashMap<>();
    private final Map<String, Screen> screens = new ConcurrentHashMap<>();
    private final Map<String, Show> shows = new ConcurrentHashMap<>();
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    // Cache layer - LRU cache for frequently accessed movies
    private final MovieCache movieCache;
    
    // Seat management - showId -> Set<seatId>
    private final Map<String, Set<String>> bookedSeats = new ConcurrentHashMap<>();
    private final SeatLockManager seatLockManager;
    
    // Strategies - Dependency Injection
    private final PricingStrategy pricingStrategy;
    private final NotificationStrategy notificationStrategy;
    
    /**
     * Constructor with dependency injection.
     */
    public EnhancedBookingService(
            PricingStrategy pricingStrategy,
            NotificationStrategy notificationStrategy) {
        this.seatLockManager = new SeatLockManager();
        this.pricingStrategy = pricingStrategy;
        this.notificationStrategy = notificationStrategy;
        // Cache up to 100 movies with 1 hour TTL
        this.movieCache = new MovieCache(100, Duration.ofHours(1));
    }
    
    /**
     * Constructor with custom cache configuration.
     */
    public EnhancedBookingService(
            PricingStrategy pricingStrategy,
            NotificationStrategy notificationStrategy,
            int cacheSize,
            Duration cacheTtl) {
        this.seatLockManager = new SeatLockManager();
        this.pricingStrategy = pricingStrategy;
        this.notificationStrategy = notificationStrategy;
        this.movieCache = new MovieCache(cacheSize, cacheTtl);
    }
    
    // ==================== Movie & Show Management ====================
    
    @Override
    public List<Movie> searchMovies(String title, City city, Language language) {
        // Search uses the underlying store, not cache (since we need to filter)
        return movies.values().stream()
            .filter(movie -> {
                boolean matchTitle = title == null || 
                    movie.getTitle().toLowerCase().contains(title.toLowerCase());
                boolean matchLanguage = language == null || 
                    movie.getLanguage() == language;
                return matchTitle && matchLanguage;
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Get movie by ID - uses cache for performance.
     */
    public Movie getMovieById(String movieId) {
        // Try cache first
        Optional<Movie> cached = movieCache.get(movieId);
        if (cached.isPresent()) {
            return cached.get();
        }
        
        // Cache miss - get from store and cache it
        Movie movie = movies.get(movieId);
        if (movie != null) {
            movieCache.put(movieId, movie);
        }
        return movie;
    }
    
    @Override
    public List<Show> getShowsForMovie(String movieId, City city) {
        return shows.values().stream()
            .filter(show -> show.getMovieId().equals(movieId))
            .filter(show -> {
                Screen screen = screens.get(show.getScreenId());
                if (screen == null) return false;
                Theater theater = theaters.get(screen.getTheaterId());
                return theater != null && (city == null || theater.getCity() == city);
            })
            .sorted(Comparator.comparing(Show::getStartTime))
            .collect(Collectors.toList());
    }
    
    @Override
    public Show getShow(String showId) {
        Show show = shows.get(showId);
        if (show == null) {
            throw new ShowNotFoundException("Show not found: " + showId);
        }
        return show;
    }
    
    // ==================== Seat Management ====================
    
    @Override
    public List<Seat> getAvailableSeats(String showId) {
        Show show = getShow(showId);
        Screen screen = screens.get(show.getScreenId());
        
        if (screen == null) {
            throw new ShowNotFoundException("Screen not found for show: " + showId);
        }
        
        Set<String> booked = bookedSeats.getOrDefault(showId, Collections.emptySet());
        
        return screen.getSeats().stream()
            .filter(seat -> !booked.contains(seat.getId()))
            .filter(seat -> !seatLockManager.isLocked(showId, seat.getId()))
            .collect(Collectors.toList());
    }
    
    @Override
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        // Validate show exists
        Show show = getShow(showId);
        
        // Validate all seats exist and are not already booked
        Set<String> booked = bookedSeats.getOrDefault(showId, Collections.emptySet());
        for (String seatId : seatIds) {
            if (booked.contains(seatId)) {
                throw new SeatNotAvailableException("Seat already booked: " + seatId);
            }
        }
        
        // Lock seats using fine-grained per-seat locking
        return seatLockManager.lockSeats(showId, seatIds, userId);
    }
    
    @Override
    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        seatLockManager.unlockSeats(showId, seatIds, userId);
    }
    
    // ==================== Booking Management ====================
    
    @Override
    public Booking createBooking(String userId, String showId, List<String> seatIds) {
        // Validate user
        User user = users.get(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userId);
        }
        
        // Validate show
        Show show = getShow(showId);
        Screen screen = screens.get(show.getScreenId());
        
        // Get seat objects
        Map<String, Seat> screenSeats = screen.getSeats().stream()
            .collect(Collectors.toMap(Seat::getId, s -> s));
        
        List<Seat> selectedSeats = new ArrayList<>();
        
        for (String seatId : seatIds) {
            Seat seat = screenSeats.get(seatId);
            if (seat == null) {
                throw new SeatNotAvailableException("Seat not found: " + seatId);
            }
            selectedSeats.add(seat);
        }
        
        // Calculate price using strategy (Money type)
        Money totalAmount = pricingStrategy.calculatePrice(show, selectedSeats);
        
        // Create booking
        String bookingId = UUID.randomUUID().toString();
        Booking booking = new Booking(
            bookingId,
            userId,
            showId,
            selectedSeats,
            totalAmount.toBigDecimal().doubleValue(), // Convert to double for now
            LocalDateTime.now()
        );
        
        bookings.put(bookingId, booking);
        return booking;
    }
    
    @Override
    public boolean confirmBooking(String bookingId, Payment payment) {
        Booking booking = getBooking(bookingId);
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking is not in PENDING state: " + bookingId);
        }
        
        // Verify payment status
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CANCELLED);
            throw new PaymentFailedException("Payment failed for booking: " + bookingId);
        }
        
        // Atomically confirm booking (in transaction-like manner)
        synchronized (this) {
            // Mark seats as booked
            Set<String> booked = bookedSeats.computeIfAbsent(
                booking.getShowId(), 
                k -> ConcurrentHashMap.newKeySet()
            );
            
            for (Seat seat : booking.getSeats()) {
                booked.add(seat.getId());
            }
            
            // Update booking status
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPayment(payment);
            
            // Unlock seats (user successfully booked)
            List<String> seatIds = booking.getSeats().stream()
                .map(Seat::getId)
                .collect(Collectors.toList());
            unlockSeats(booking.getShowId(), seatIds, booking.getUserId());
            
            // Send confirmation notification
            User user = users.get(booking.getUserId());
            if (user != null && notificationStrategy != null) {
                notificationStrategy.notifyBookingConfirmed(user, booking);
            }
        }
        
        System.out.println("✅ Booking confirmed: " + bookingId);
        return true;
    }
    
    @Override
    public boolean cancelBooking(String bookingId) {
        Booking booking = getBooking(bookingId);
        
        if (booking.getStatus() != BookingStatus.CONFIRMED && 
            booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Cannot cancel booking in state: " + booking.getStatus());
        }
        
        synchronized (this) {
            // Release seats
            Set<String> booked = bookedSeats.get(booking.getShowId());
            if (booked != null) {
                for (Seat seat : booking.getSeats()) {
                    booked.remove(seat.getId());
                }
            }
            
            // Update booking status
            booking.setStatus(BookingStatus.CANCELLED);
            
            // Send cancellation notification
            User user = users.get(booking.getUserId());
            if (user != null && notificationStrategy != null) {
                notificationStrategy.notifyBookingCancelled(user, booking);
            }
        }
        
        System.out.println("❌ Booking cancelled: " + bookingId);
        return true;
    }
    
    @Override
    public Booking getBooking(String bookingId) {
        Booking booking = bookings.get(bookingId);
        if (booking == null) {
            throw new BookingNotFoundException("Booking not found: " + bookingId);
        }
        return booking;
    }
    
    @Override
    public List<Booking> getUserBookings(String userId) {
        return bookings.values().stream()
            .filter(booking -> booking.getUserId().equals(userId))
            .sorted(Comparator.comparing(Booking::getBookingTime).reversed())
            .collect(Collectors.toList());
    }
    
    // ==================== Theater Management ====================
    
    @Override
    public List<Theater> getTheaters(City city) {
        return theaters.values().stream()
            .filter(theater -> city == null || theater.getCity() == city)
            .collect(Collectors.toList());
    }
    
    @Override
    public Theater getTheater(String theaterId) {
        return theaters.get(theaterId);
    }
    
    // ==================== Admin/Setup Methods ====================
    
    public void addMovie(Movie movie) {
        movies.put(movie.getId(), movie);
        // Proactively cache new movies (likely to be searched soon)
        movieCache.put(movie.getId(), movie);
    }
    
    /**
     * Update movie - invalidate cache.
     */
    public void updateMovie(Movie movie) {
        movies.put(movie.getId(), movie);
        // Invalidate cache to force refresh
        movieCache.invalidate(movie.getId());
    }
    
    /**
     * Get cache statistics.
     */
    public Map<String, Object> getCacheStats() {
        return movieCache.getStats();
    }
    
    /**
     * Clear movie cache.
     */
    public void clearCache() {
        movieCache.clear();
    }
    
    public void addTheater(Theater theater) {
        theaters.put(theater.getId(), theater);
    }
    
    public void addScreen(Screen screen) {
        screens.put(screen.getId(), screen);
    }
    
    public void addShow(Show show) {
        shows.put(show.getId(), show);
    }
    
    public void addUser(User user) {
        users.put(user.getId(), user);
    }
    
    /**
     * Graceful shutdown - cleanup resources.
     */
    public void shutdown() {
        seatLockManager.shutdown();
        System.out.println("🛑 BookingService shutdown complete");
    }
}
