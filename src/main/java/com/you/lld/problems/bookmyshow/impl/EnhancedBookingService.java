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
 * Single consolidated BookMyShow implementation.
 *
 * Patterns used:
 *   State        -- Booking lifecycle (Pending → Confirmed / Cancelled / Expired)
 *   Strategy     -- PricingStrategy (Simple / Dynamic), NotificationStrategy (Email / SMS)
 *   Composite    -- MultiChannelNotificationStrategy fans out to all channels
 *   Observer     -- BookingObserver / BookingNotifier (notified on every state change)
 *   Cache-Aside  -- MovieCache (LRU + TTL) for read-heavy movie lookups
 *
 * Concurrency:
 *   - ConcurrentHashMap for all data stores
 *   - SeatLockManager for fine-grained per-seat locking with auto-expiry
 *   - synchronized(booking) for per-booking state transitions (not global lock)
 */
public class EnhancedBookingService implements BookingService {

    private final Map<String, Movie> movies = new ConcurrentHashMap<>();
    private final Map<String, Theater> theaters = new ConcurrentHashMap<>();
    private final Map<String, Screen> screens = new ConcurrentHashMap<>();
    private final Map<String, Show> shows = new ConcurrentHashMap<>();
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();

    // showId → set of permanently booked seat IDs
    private final Map<String, Set<String>> bookedSeats = new ConcurrentHashMap<>();

    private final SeatLockManager seatLockManager;
    private final MovieCache movieCache;
    private final PricingStrategy pricingStrategy;
    private final NotificationStrategy notificationStrategy;

    public EnhancedBookingService(PricingStrategy pricingStrategy,
                                  NotificationStrategy notificationStrategy) {
        this.seatLockManager = new SeatLockManager();
        this.pricingStrategy = pricingStrategy;
        this.notificationStrategy = notificationStrategy;
        this.movieCache = new MovieCache(100, Duration.ofHours(1));
    }

    // ======================== Movie & Show queries ========================

    @Override
    public List<Movie> searchMovies(String title, City city, Language language) {
        return movies.values().stream()
            .filter(m -> title == null || m.getTitle().toLowerCase().contains(title.toLowerCase()))
            .filter(m -> language == null || m.getLanguage() == language)
            .collect(Collectors.toList());
    }

    public Movie getMovieById(String movieId) {
        Optional<Movie> cached = movieCache.get(movieId);
        if (cached.isPresent()) return cached.get();

        Movie movie = movies.get(movieId);
        if (movie != null) movieCache.put(movieId, movie);
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
        if (show == null) throw new ShowNotFoundException("Show not found: " + showId);
        return show;
    }

    // ======================== Seat management ========================

    @Override
    public List<Seat> getAvailableSeats(String showId) {
        Show show = getShow(showId);
        Screen screen = screens.get(show.getScreenId());
        if (screen == null) throw new ShowNotFoundException("Screen not found for show: " + showId);

        Set<String> booked = bookedSeats.getOrDefault(showId, Collections.emptySet());

        return screen.getSeats().stream()
            .filter(seat -> !booked.contains(seat.getId()))
            .filter(seat -> !seatLockManager.isLocked(showId, seat.getId()))
            .collect(Collectors.toList());
    }

    @Override
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        getShow(showId); // validate show exists

        Set<String> booked = bookedSeats.getOrDefault(showId, Collections.emptySet());
        for (String seatId : seatIds) {
            if (booked.contains(seatId)) {
                throw new SeatNotAvailableException("Seat already booked: " + seatId);
            }
        }
        return seatLockManager.lockSeats(showId, seatIds, userId);
    }

    @Override
    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        seatLockManager.unlockSeats(showId, seatIds, userId);
    }

    // ======================== Booking lifecycle ========================

    /**
     * Create a PENDING booking.
     * Validates that the requesting user actually holds the seat locks.
     * Registers a BookingNotifier (Observer) so state changes auto-notify the user.
     */
    @Override
    public Booking createBooking(String userId, String showId, List<String> seatIds) {
        User user = users.get(userId);
        if (user == null) throw new IllegalArgumentException("User not found: " + userId);

        Show show = getShow(showId);
        if (show.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot book for a show that has already started");
        }

        Screen screen = screens.get(show.getScreenId());
        Map<String, Seat> screenSeats = screen.getSeats().stream()
            .collect(Collectors.toMap(Seat::getId, s -> s));

        List<Seat> selectedSeats = new ArrayList<>();
        for (String seatId : seatIds) {
            if (!seatLockManager.isLockedByUser(showId, seatId, userId)) {
                throw new SeatNotAvailableException(
                    "Seat " + seatId + " is not locked by user " + userId + " -- lock seats first");
            }
            Seat seat = screenSeats.get(seatId);
            if (seat == null) throw new SeatNotAvailableException("Seat not found: " + seatId);
            selectedSeats.add(seat);
        }

        Money totalMoney = pricingStrategy.calculatePrice(show, selectedSeats);
        double totalAmount = totalMoney.toBigDecimal().doubleValue();

        String bookingId = UUID.randomUUID().toString();
        Booking booking = new Booking(bookingId, userId, showId, selectedSeats,
                                      totalAmount, LocalDateTime.now());

        booking.addObserver(new BookingNotifier(user, notificationStrategy));

        bookings.put(bookingId, booking);
        System.out.println("[BookingService] Booking created: " + bookingId
                + " | " + selectedSeats.size() + " seats | Amount: "
                + String.format("%.2f", totalAmount));
        return booking;
    }

    /**
     * Confirm a PENDING booking.
     *
     * Uses synchronized(booking) for per-booking locking (not global).
     * State pattern validates the transition; this method handles side effects:
     *   - Mark seats as permanently booked
     *   - Release the temporary locks
     *   - Observer auto-fires notification
     */
    @Override
    public boolean confirmBooking(String bookingId, Payment payment) {
        Booking booking = getBooking(bookingId);

        synchronized (booking) {
            booking.confirm(payment);

            Set<String> booked = bookedSeats.computeIfAbsent(
                booking.getShowId(), k -> ConcurrentHashMap.newKeySet());
            for (Seat seat : booking.getSeats()) {
                booked.add(seat.getId());
            }

            List<String> seatIds = booking.getSeats().stream()
                .map(Seat::getId).collect(Collectors.toList());
            seatLockManager.unlockSeats(booking.getShowId(), seatIds, booking.getUserId());
        }

        System.out.println("[BookingService] Booking confirmed: " + bookingId);
        return true;
    }

    /**
     * Cancel a PENDING or CONFIRMED booking.
     *
     * Side effects:
     *   - Release permanently booked seats (if was CONFIRMED)
     *   - Observer auto-fires notification
     */
    @Override
    public boolean cancelBooking(String bookingId) {
        Booking booking = getBooking(bookingId);
        boolean wasConfirmed = booking.getStatus() == BookingStatus.CONFIRMED;

        synchronized (booking) {
            booking.cancel();

            if (wasConfirmed) {
                Set<String> booked = bookedSeats.get(booking.getShowId());
                if (booked != null) {
                    for (Seat seat : booking.getSeats()) {
                        booked.remove(seat.getId());
                    }
                }
            } else {
                List<String> seatIds = booking.getSeats().stream()
                    .map(Seat::getId).collect(Collectors.toList());
                seatLockManager.unlockSeats(booking.getShowId(), seatIds, booking.getUserId());
            }
        }

        System.out.println("[BookingService] Booking cancelled: " + bookingId);
        return true;
    }

    @Override
    public Booking getBooking(String bookingId) {
        Booking booking = bookings.get(bookingId);
        if (booking == null) throw new BookingNotFoundException("Booking not found: " + bookingId);
        return booking;
    }

    @Override
    public List<Booking> getUserBookings(String userId) {
        return bookings.values().stream()
            .filter(b -> b.getUserId().equals(userId))
            .sorted(Comparator.comparing(Booking::getBookingTime).reversed())
            .collect(Collectors.toList());
    }

    // ======================== Theater queries ========================

    @Override
    public List<Theater> getTheaters(City city) {
        return theaters.values().stream()
            .filter(t -> city == null || t.getCity() == city)
            .collect(Collectors.toList());
    }

    @Override
    public Theater getTheater(String theaterId) {
        return theaters.get(theaterId);
    }

    // ======================== Admin / setup ========================

    public void addMovie(Movie movie) {
        movies.put(movie.getId(), movie);
        movieCache.put(movie.getId(), movie);
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

    public Map<String, Object> getCacheStats() {
        return movieCache.getStats();
    }

    public void shutdown() {
        seatLockManager.shutdown();
        System.out.println("[BookingService] Shutdown complete");
    }
}
