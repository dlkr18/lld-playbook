# bookmyshow - Complete Implementation

## 📁 Project Structure (23 files)

```
bookmyshow/
├── BookMyShowDemo.java
├── api/BookingService.java
├── exceptions/BookingNotFoundException.java
├── exceptions/PaymentFailedException.java
├── exceptions/SeatNotAvailableException.java
├── exceptions/ShowNotFoundException.java
├── impl/BookingServiceImpl.java
├── impl/SeatLockManager.java
├── model/Booking.java
├── model/BookingStatus.java
├── model/City.java
├── model/Genre.java
├── model/Language.java
├── model/Movie.java
├── model/Payment.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/Screen.java
├── model/Seat.java
├── model/SeatType.java
├── model/Show.java
├── model/Theater.java
├── model/User.java
```

## 📝 Source Code

### 📄 `BookMyShowDemo.java`

```java
package com.you.lld.problems.bookmyshow;

/**
 * BookMyShow System - Demo Application
 * 
 * This is a placeholder implementation.
 * Complete implementation with models, API, and services is pending.
 */
public class BookMyShowDemo {
    
    public static void main(String[] args) {
        System.out.println("🎯 BookMyShow System");
        System.out.println("=" + String.format("%70s", "").replace(" ", "="));
        System.out.println();
        System.out.println("⚠️  Implementation in progress...");
        System.out.println();
        System.out.println("📂 Directory structure created:");
        System.out.println("   - model/      (Domain models)");
        System.out.println("   - api/        (Service interfaces)");
        System.out.println("   - impl/       (Implementations)");
        System.out.println("   - exceptions/ (Custom exceptions)");
        System.out.println();
        System.out.println("💡 Check docs/problems/bookmyshow/ for design details");
    }
}
```

### 📄 `api/BookingService.java`

```java
package com.you.lld.problems.bookmyshow.api;

import com.you.lld.problems.bookmyshow.model.*;
import java.util.List;

public interface BookingService {
    
    // Movie & Show Management
    List<Movie> searchMovies(String title, City city, Language language);
    List<Show> getShowsForMovie(String movieId, City city);
    Show getShow(String showId);
    
    // Seat Management
    List<Seat> getAvailableSeats(String showId);
    boolean lockSeats(String showId, List<String> seatIds, String userId);
    void unlockSeats(String showId, List<String> seatIds, String userId);
    
    // Booking Management
    Booking createBooking(String userId, String showId, List<String> seatIds);
    boolean confirmBooking(String bookingId, Payment payment);
    boolean cancelBooking(String bookingId);
    Booking getBooking(String bookingId);
    List<Booking> getUserBookings(String userId);
    
    // Theater Management
    List<Theater> getTheaters(City city);
    Theater getTheater(String theaterId);
}
```

### 📄 `exceptions/BookingNotFoundException.java`

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String message) {
        super(message);
    }
}
```

### 📄 `exceptions/PaymentFailedException.java`

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class PaymentFailedException extends RuntimeException {
    public PaymentFailedException(String message) {
        super(message);
    }
}
```

### 📄 `exceptions/SeatNotAvailableException.java`

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class SeatNotAvailableException extends RuntimeException {
    public SeatNotAvailableException(String message) {
        super(message);
    }
}
```

### 📄 `exceptions/ShowNotFoundException.java`

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class ShowNotFoundException extends RuntimeException {
    public ShowNotFoundException(String message) {
        super(message);
    }
}
```

### 📄 `impl/BookingServiceImpl.java`

```java
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
```

### 📄 `impl/SeatLockManager.java`

```java
package com.you.lld.problems.bookmyshow.impl;

import java.util.*;
import java.util.concurrent.*;

/**
 * Seat Lock Manager with fine-grained per-seat locking for high throughput.
 * Uses seat-level locks instead of show-level locks to allow concurrent bookings.
 * 
 * Key Design Decisions:
 * - Per-seat locking (showId:seatId) NOT per-show locking
 * - Sorted locking to prevent deadlocks
 * - Atomic putIfAbsent operations
 * - Automatic rollback on failures
 * - 5-minute lock timeouts
 */
public class SeatLockManager {
    // Key: "showId:seatId" -> LockInfo
    private final ConcurrentHashMap<String, LockInfo> seatLocks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private static final long LOCK_TIMEOUT_MS = 300000; // 5 minutes
    
    private static class LockInfo {
        final String userId;
        final long expiryTime;
        final ScheduledFuture<?> unlockTask;
        
        LockInfo(String userId, long expiryTime, ScheduledFuture<?> task) {
            this.userId = userId;
            this.expiryTime = expiryTime;
            this.unlockTask = task;
        }
    }
    
    /**
     * Locks multiple seats atomically. Uses sorted locking to prevent deadlock.
     * @return true if all seats were locked successfully, false otherwise
     */
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            return false;
        }
        
        // Sort seat IDs to prevent deadlock (always acquire locks in same order)
        List<String> sortedSeatIds = new ArrayList<>(seatIds);
        Collections.sort(sortedSeatIds);
        
        // Generate keys
        List<String> seatKeys = new ArrayList<>();
        for (String seatId : sortedSeatIds) {
            seatKeys.add(getSeatKey(showId, seatId));
        }
        
        // Phase 1: Check all seats are available
        long now = System.currentTimeMillis();
        List<String> unavailableSeats = new ArrayList<>();
        
        for (String seatKey : seatKeys) {
            LockInfo existing = seatLocks.get(seatKey);
            
            if (existing != null) {
                // Check if expired
                if (existing.expiryTime > now) {
                    unavailableSeats.add(seatKey);
                } else {
                    // Clean up expired lock
                    existing.unlockTask.cancel(false);
                    seatLocks.remove(seatKey);
                }
            }
        }
        
        if (!unavailableSeats.isEmpty()) {
            System.out.println("Seats unavailable: " + unavailableSeats);
            return false;
        }
        
        // Phase 2: Lock all seats atomically
        long expiryTime = now + LOCK_TIMEOUT_MS;
        List<LockInfo> createdLocks = new ArrayList<>();
        
        try {
            for (int i = 0; i < seatKeys.size(); i++) {
                String seatKey = seatKeys.get(i);
                String seatId = sortedSeatIds.get(i);
                
                ScheduledFuture<?> task = scheduler.schedule(
                    () -> unlockSeat(showId, seatId, userId),
                    LOCK_TIMEOUT_MS,
                    TimeUnit.MILLISECONDS
                );
                
                LockInfo lockInfo = new LockInfo(userId, expiryTime, task);
                
                // Use putIfAbsent for atomicity
                LockInfo previous = seatLocks.putIfAbsent(seatKey, lockInfo);
                
                if (previous != null) {
                    // Race condition - someone locked it between check and lock
                    task.cancel(false);
                    throw new IllegalStateException("Seat locked by another user: " + seatKey);
                }
                
                createdLocks.add(lockInfo);
            }
            
            System.out.println("✅ Locked " + seatIds.size() + " seats for user " + userId);
            return true;
            
        } catch (Exception e) {
            // Rollback: unlock all seats we've locked so far
            System.out.println("❌ Failed to lock seats, rolling back: " + e.getMessage());
            for (int i = 0; i < createdLocks.size(); i++) {
                String seatKey = seatKeys.get(i);
                LockInfo lockInfo = createdLocks.get(i);
                lockInfo.unlockTask.cancel(false);
                seatLocks.remove(seatKey, lockInfo); // Atomic remove only if same object
            }
            return false;
        }
    }
    
    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            unlockSeat(showId, seatId, userId);
        }
    }
    
    private void unlockSeat(String showId, String seatId, String userId) {
        String seatKey = getSeatKey(showId, seatId);
        LockInfo lockInfo = seatLocks.get(seatKey);
        
        if (lockInfo != null && lockInfo.userId.equals(userId)) {
            lockInfo.unlockTask.cancel(false);
            seatLocks.remove(seatKey, lockInfo);
            System.out.println("🔓 Unlocked seat: " + seatId + " for user " + userId);
        }
    }
    
    public boolean isLocked(String showId, String seatId) {
        String seatKey = getSeatKey(showId, seatId);
        LockInfo lockInfo = seatLocks.get(seatKey);
        
        if (lockInfo == null) {
            return false;
        }
        
        // Check if expired
        if (lockInfo.expiryTime <= System.currentTimeMillis()) {
            unlockSeat(showId, seatId, lockInfo.userId);
            return false;
        }
        
        return true;
    }
    
    private String getSeatKey(String showId, String seatId) {
        return showId + ":" + seatId;
    }
    
    public void shutdown() {
        System.out.println("Shutting down SeatLockManager...");
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

### 📄 `model/Booking.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;
import java.util.List;

public class Booking {
    private final String id;
    private final String userId;
    private final String showId;
    private final List<Seat> seats;
    private final double totalAmount;
    private final LocalDateTime bookingTime;
    private BookingStatus status;
    private Payment payment;

    public Booking(String id, String userId, String showId, List<Seat> seats, 
                   double totalAmount, LocalDateTime bookingTime) {
        this.id = id;
        this.userId = userId;
        this.showId = showId;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
        this.status = BookingStatus.PENDING;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getShowId() { return showId; }
    public List<Seat> getSeats() { return seats; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public BookingStatus getStatus() { return status; }
    public Payment getPayment() { return payment; }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    @Override
    public String toString() {
        return "Booking{id='" + id + "', userId='" + userId + "', seats=" + seats.size() + 
               ", totalAmount=" + totalAmount + ", status=" + status + '}';
    }
}
```

### 📄 `model/BookingStatus.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum BookingStatus {
    PENDING, CONFIRMED, CANCELLED, EXPIRED
}
```

### 📄 `model/City.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum City {
    BANGALORE, MUMBAI, DELHI, HYDERABAD, CHENNAI, KOLKATA, PUNE, AHMEDABAD
}
```

### 📄 `model/Genre.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum Genre {
    ACTION, COMEDY, DRAMA, HORROR, ROMANCE, THRILLER, SCI_FI, DOCUMENTARY, ANIMATION
}
```

### 📄 `model/Language.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum Language {
    ENGLISH, HINDI, TAMIL, TELUGU, KANNADA, MALAYALAM, BENGALI, MARATHI
}
```

### 📄 `model/Movie.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.Duration;
import java.util.List;

public class Movie {
    private final String id;
    private final String title;
    private final String description;
    private final Duration duration;
    private final Language language;
    private final Genre genre;
    private final List<String> cast;
    private final double rating;

    public Movie(String id, String title, String description, Duration duration, 
                 Language language, Genre genre, List<String> cast, double rating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.language = language;
        this.genre = genre;
        this.cast = cast;
        this.rating = rating;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Duration getDuration() { return duration; }
    public Language getLanguage() { return language; }
    public Genre getGenre() { return genre; }
    public List<String> getCast() { return cast; }
    public double getRating() { return rating; }

    @Override
    public String toString() {
        return "Movie{id='" + id + "', title='" + title + "', language=" + language + ", rating=" + rating + '}';
    }
}
```

### 📄 `model/Payment.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String bookingId;
    private final double amount;
    private final PaymentMethod method;
    private final LocalDateTime paymentTime;
    private PaymentStatus status;

    public Payment(String id, String bookingId, double amount, 
                   PaymentMethod method, LocalDateTime paymentTime) {
        this.id = id;
        this.bookingId = bookingId;
        this.amount = amount;
        this.method = method;
        this.paymentTime = paymentTime;
        this.status = PaymentStatus.PENDING;
    }

    public String getId() { return id; }
    public String getBookingId() { return bookingId; }
    public double getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public PaymentStatus getStatus() { return status; }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Payment{id='" + id + "', amount=" + amount + ", method=" + method + ", status=" + status + '}';
    }
}
```

### 📄 `model/PaymentMethod.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum PaymentMethod {
    CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET
}
```

### 📄 `model/PaymentStatus.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum PaymentStatus {
    PENDING, SUCCESS, FAILED, REFUNDED
}
```

### 📄 `model/Screen.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.util.List;

public class Screen {
    private final String id;
    private final String name;
    private final String theaterId;
    private final List<Seat> seats;

    public Screen(String id, String name, String theaterId, List<Seat> seats) {
        this.id = id;
        this.name = name;
        this.theaterId = theaterId;
        this.seats = seats;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getTheaterId() { return theaterId; }
    public List<Seat> getSeats() { return seats; }

    @Override
    public String toString() {
        return "Screen{id='" + id + "', name='" + name + "', seats=" + seats.size() + '}';
    }
}
```

### 📄 `model/Seat.java`

```java
package com.you.lld.problems.bookmyshow.model;

public class Seat {
    private final String id;
    private final String seatNumber;
    private final SeatType type;
    private final double price;

    public Seat(String id, String seatNumber, SeatType type, double price) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.type = type;
        this.price = price;
    }

    public String getId() { return id; }
    public String getSeatNumber() { return seatNumber; }
    public SeatType getType() { return type; }
    public double getPrice() { return price; }

    @Override
    public String toString() {
        return "Seat{id='" + id + "', seatNumber='" + seatNumber + "', type=" + type + ", price=" + price + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Seat seat = (Seat) o;
        return id.equals(seat.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
```

### 📄 `model/SeatType.java`

```java
package com.you.lld.problems.bookmyshow.model;

public enum SeatType {
    REGULAR(100.0),
    PREMIUM(200.0),
    VIP(300.0),
    RECLINER(500.0);

    private final double basePrice;

    SeatType(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getBasePrice() {
        return basePrice;
    }
}
```

### 📄 `model/Show.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class Show {
    private final String id;
    private final String movieId;
    private final String screenId;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;

    public Show(String id, String movieId, String screenId, 
                LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.movieId = movieId;
        this.screenId = screenId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getId() { return id; }
    public String getMovieId() { return movieId; }
    public String getScreenId() { return screenId; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }

    @Override
    public String toString() {
        return "Show{id='" + id + "', movieId='" + movieId + "', startTime=" + startTime + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Show show = (Show) o;
        return id.equals(show.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
```

### 📄 `model/Theater.java`

```java
package com.you.lld.problems.bookmyshow.model;

import java.util.List;

public class Theater {
    private final String id;
    private final String name;
    private final String address;
    private final City city;
    private final List<Screen> screens;

    public Theater(String id, String name, String address, City city, List<Screen> screens) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.screens = screens;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public City getCity() { return city; }
    public List<Screen> getScreens() { return screens; }

    @Override
    public String toString() {
        return "Theater{id='" + id + "', name='" + name + "', city=" + city + ", screens=" + screens.size() + '}';
    }
}
```

### 📄 `model/User.java`

```java
package com.you.lld.problems.bookmyshow.model;

public class User {
    private final String id;
    private final String name;
    private final String email;
    private final String phone;

    public User(String id, String name, String email, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }

    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
}
```

