package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.BookingService;
import com.you.lld.problems.bookmyshow.model.*;
import com.you.lld.problems.bookmyshow.exceptions.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

/**
 * In-Memory implementation of BookMyShow booking service
 */
public class BookingServiceImpl implements BookingService {
    
    // Data stores
    private final Map<String, Movie> movies = new ConcurrentHashMap<>();
    private final Map<String, Theater> theaters = new ConcurrentHashMap<>();
    private final Map<String, Screen> screens = new ConcurrentHashMap<>();
    private final Map<String, Show> shows = new ConcurrentHashMap<>();
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    // Seat management
    private final Map<String, Set<String>> bookedSeats = new ConcurrentHashMap<>(); // showId -> Set<seatId>
    private final SeatLockManager seatLockManager = new SeatLockManager();
    
    @Override
    public List<Movie> searchMovies(String title, City city, Language language) {
        return movies.values().stream()
            .filter(movie -> {
                boolean matchTitle = title == null || movie.getTitle().toLowerCase().contains(title.toLowerCase());
                boolean matchLanguage = language == null || movie.getLanguage() == language;
                return matchTitle && matchLanguage;
            })
            .collect(Collectors.toList());
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
        
        // Lock seats using per-seat locking
        return seatLockManager.lockSeats(showId, seatIds, userId);
    }
    
    @Override
    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        seatLockManager.unlockSeats(showId, seatIds, userId);
    }
    
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
        double totalAmount = 0.0;
        
        for (String seatId : seatIds) {
            Seat seat = screenSeats.get(seatId);
            if (seat == null) {
                throw new SeatNotAvailableException("Seat not found: " + seatId);
            }
            selectedSeats.add(seat);
            totalAmount += seat.getPrice();
        }
        
        // Create booking
        String bookingId = UUID.randomUUID().toString();
        Booking booking = new Booking(
            bookingId,
            userId,
            showId,
            selectedSeats,
            totalAmount,
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
        
        // Simulate payment processing
        try {
            processPayment(payment);
            
            // Mark seats as booked
            String showId = booking.getShowId();
            Set<String> booked = bookedSeats.computeIfAbsent(showId, k -> ConcurrentHashMap.newKeySet());
            
            List<String> seatIds = booking.getSeats().stream()
                .map(Seat::getId)
                .collect(Collectors.toList());
            
            booked.addAll(seatIds);
            
            // Unlock seats (no longer need the lock as they're booked)
            seatLockManager.unlockSeats(showId, seatIds, booking.getUserId());
            
            // Update booking status
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPayment(payment);
            payment.setStatus(PaymentStatus.SUCCESS);
            
            System.out.println("✅ Booking confirmed: " + bookingId);
            return true;
            
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            throw new PaymentFailedException("Payment failed: " + e.getMessage());
        }
    }
    
    @Override
    public boolean cancelBooking(String bookingId) {
        Booking booking = getBooking(bookingId);
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return true;
        }
        
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Can only cancel CONFIRMED bookings");
        }
        
        // Free up seats
        String showId = booking.getShowId();
        Set<String> booked = bookedSeats.get(showId);
        if (booked != null) {
            List<String> seatIds = booking.getSeats().stream()
                .map(Seat::getId)
                .collect(Collectors.toList());
            booked.removeAll(seatIds);
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
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
            .collect(Collectors.toList());
    }
    
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
    
    // Helper methods for data seeding
    public void addMovie(Movie movie) {
        movies.put(movie.getId(), movie);
    }
    
    public void addTheater(Theater theater) {
        theaters.put(theater.getId(), theater);
        for (Screen screen : theater.getScreens()) {
            screens.put(screen.getId(), screen);
        }
    }
    
    public void addShow(Show show) {
        shows.put(show.getId(), show);
        bookedSeats.putIfAbsent(show.getId(), ConcurrentHashMap.newKeySet());
    }
    
    public void addUser(User user) {
        users.put(user.getId(), user);
    }
    
    private void processPayment(Payment payment) {
        // Simulate payment processing delay
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Simulate random payment failure (5% chance)
        if (Math.random() < 0.05) {
            throw new PaymentFailedException("Payment gateway error");
        }
    }
    
    public void shutdown() {
        seatLockManager.shutdown();
    }
}
