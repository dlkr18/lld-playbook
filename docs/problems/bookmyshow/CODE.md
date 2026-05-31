# bookmyshow - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/bookmyshow/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py bookmyshow`.

## Project Structure (38 files)

```
bookmyshow/
├── impl/BookMyShowDemo.java
├── api/BookingService.java
├── api/NotificationStrategy.java
├── api/PricingStrategy.java
├── model/Booking.java
├── model/BookingObserver.java
├── model/BookingState.java
├── model/BookingStatus.java
├── model/CancelledBookingState.java
├── model/City.java
├── model/ConfirmedState.java
├── model/ExpiredState.java
├── model/Genre.java
├── model/Language.java
├── model/Movie.java
├── model/Payment.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/PendingState.java
├── model/Screen.java
├── model/Seat.java
├── model/SeatType.java
├── model/Show.java
├── model/Theater.java
├── model/User.java
├── impl/BookingNotifier.java
├── impl/DynamicPricingStrategy.java
├── impl/EmailNotificationStrategy.java
├── impl/EnhancedBookingService.java
├── impl/MultiChannelNotificationStrategy.java
├── impl/SMSNotificationStrategy.java
├── impl/SeatLockManager.java
├── impl/SimplePricingStrategy.java
├── cache/MovieCache.java
├── exceptions/BookingNotFoundException.java
├── exceptions/PaymentFailedException.java
├── exceptions/SeatNotAvailableException.java
├── exceptions/ShowNotFoundException.java
```

## Source Code

### `impl/BookMyShowDemo.java`

<details>
<summary>Click to view impl/BookMyShowDemo.java</summary>

```java
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
```

</details>

### `api/BookingService.java`

<details>
<summary>Click to view api/BookingService.java</summary>

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

</details>

### `api/NotificationStrategy.java`

<details>
<summary>Click to view api/NotificationStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.api;

import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Strategy interface for sending notifications to users.
 * Allows different notification channels: email, SMS, push, etc.
 */
public interface NotificationStrategy {
    
    /**
     * Send booking confirmation notification.
     * @param user The user to notify
     * @param booking The confirmed booking
     */
    void notifyBookingConfirmed(User user, Booking booking);
    
    /**
     * Send booking cancellation notification.
     * @param user The user to notify
     * @param booking The cancelled booking
     */
    void notifyBookingCancelled(User user, Booking booking);
    
    /**
     * Send booking reminder notification (e.g., 1 hour before show).
     * @param user The user to notify
     * @param booking The upcoming booking
     */
    void notifyBookingReminder(User user, Booking booking);
}
```

</details>

### `api/PricingStrategy.java`

<details>
<summary>Click to view api/PricingStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.api;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import java.util.List;

/**
 * Strategy interface for calculating ticket pricing.
 * Allows different pricing models: base, dynamic, surge, promotional.
 */
public interface PricingStrategy {
    
    /**
     * Calculate total price for given seats in a show.
     * @param show The movie show
     * @param seats List of seats to book
     * @return Total amount in Money
     */
    Money calculatePrice(Show show, List<Seat> seats);
    
    /**
     * Get pricing description/name for display.
     */
    String getDescription();
}
```

</details>

### `model/Booking.java`

<details>
<summary>Click to view model/Booking.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Booking entity with State pattern + Observer pattern.
 *
 * State pattern: Booking delegates confirm/cancel/expire to its BookingState.
 *     State objects validate transitions and set internal fields; side effects
 *     (seat release, refund) are handled by the service layer.
 *
 * Observer pattern: Registered BookingObservers are notified on every state change.
 *     Notification formatting lives in BookingNotifier (SRP), not here.
 */
public class Booking {
    private final String id;
    private final String userId;
    private final String showId;
    private final List<Seat> seats;
    private final double totalAmount;
    private final LocalDateTime bookingTime;

    private BookingState state;
    private Payment payment;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;

    private final List<BookingObserver> observers = new CopyOnWriteArrayList<>();

    public Booking(String id, String userId, String showId, List<Seat> seats,
                   double totalAmount, LocalDateTime bookingTime) {
        this.id = id;
        this.userId = userId;
        this.showId = showId;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
        this.state = PendingState.INSTANCE;
    }

    // ─── State transitions (delegate to current state) ────────────────

    public void confirm(Payment payment) {
        this.state = this.state.confirm(this, payment);
        notifyObservers();
    }

    public void cancel() {
        this.state = this.state.cancel(this);
        notifyObservers();
    }

    public void expire() {
        this.state = this.state.expire(this);
        notifyObservers();
    }

    // ─── Observer ─────────────────────────────────────────────────────

    public void addObserver(BookingObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(BookingObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        for (BookingObserver o : observers) {
            o.update(this);
        }
    }

    // ─── Package-private setters for State objects ────────────────────

    void setPaymentInternal(Payment payment)            { this.payment = payment; }
    void setConfirmedAtInternal(LocalDateTime at)        { this.confirmedAt = at; }
    void setCancelledAtInternal(LocalDateTime at)        { this.cancelledAt = at; }

    // ─── Getters ──────────────────────────────────────────────────────

    public String getId()                { return id; }
    public String getUserId()            { return userId; }
    public String getShowId()            { return showId; }
    public List<Seat> getSeats()         { return seats; }
    public double getTotalAmount()       { return totalAmount; }
    public LocalDateTime getBookingTime(){ return bookingTime; }
    public BookingStatus getStatus()     { return state.getStatus(); }
    public Payment getPayment()          { return payment; }
    public LocalDateTime getConfirmedAt(){ return confirmedAt; }
    public LocalDateTime getCancelledAt(){ return cancelledAt; }

    @Override
    public String toString() {
        return "Booking{id='" + id + "', showId='" + showId +
                "', seats=" + seats.size() +
                ", amount=" + String.format("%.2f", totalAmount) +
                ", status=" + getStatus() + '}';
    }
}
```

</details>

### `model/BookingObserver.java`

<details>
<summary>Click to view model/BookingObserver.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

/**
 * Observer for Booking lifecycle events.
 * Implementations (e.g. BookingNotifier) handle notification formatting/delivery.
 * Keeps Booking entity pure -- SRP.
 */
public interface BookingObserver {
    void update(Booking booking);
}
```

</details>

### `model/BookingState.java`

<details>
<summary>Click to view model/BookingState.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

/**
 * State pattern for Booking lifecycle.
 * Each state defines which transitions are legal; invalid ops throw IllegalStateException.
 *
 *   Pending  --confirm-->  Confirmed
 *   Pending  --cancel-->   Cancelled
 *   Pending  --expire-->   Expired   (lock timeout)
 *   Confirmed --cancel-->  Cancelled
 *   Cancelled / Expired    terminal (all throw)
 *
 * States are STATELESS singletons -- all mutable data lives on Booking.
 * Side effects (seat release, refund) are handled by the service, not the states.
 */
public interface BookingState {
    BookingState confirm(Booking booking, Payment payment);
    BookingState cancel(Booking booking);
    BookingState expire(Booking booking);
    BookingStatus getStatus();
}
```

</details>

### `model/BookingStatus.java`

<details>
<summary>Click to view model/BookingStatus.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    EXPIRED
}
```

</details>

### `model/CancelledBookingState.java`

<details>
<summary>Click to view model/CancelledBookingState.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public class CancelledBookingState implements BookingState {
    public static final CancelledBookingState INSTANCE = new CancelledBookingState();
    private CancelledBookingState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingState cancel(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already cancelled");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.CANCELLED; }
}
```

</details>

### `model/City.java`

<details>
<summary>Click to view model/City.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum City {
    BANGALORE,
    MUMBAI,
    DELHI,
    HYDERABAD,
    CHENNAI,
    KOLKATA,
    PUNE,
    AHMEDABAD
}
```

</details>

### `model/ConfirmedState.java`

<details>
<summary>Click to view model/ConfirmedState.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class ConfirmedState implements BookingState {
    public static final ConfirmedState INSTANCE = new ConfirmedState();
    private ConfirmedState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " is already confirmed");
    }

    @Override
    public BookingState cancel(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return CancelledBookingState.INSTANCE;
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Cannot expire a confirmed booking");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.CONFIRMED; }
}
```

</details>

### `model/ExpiredState.java`

<details>
<summary>Click to view model/ExpiredState.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public class ExpiredState implements BookingState {
    public static final ExpiredState INSTANCE = new ExpiredState();
    private ExpiredState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        throw new IllegalStateException("Booking " + booking.getId() + " has expired -- seats released");
    }

    @Override
    public BookingState cancel(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " has already expired");
    }

    @Override
    public BookingState expire(Booking booking) {
        throw new IllegalStateException("Booking " + booking.getId() + " has already expired");
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.EXPIRED; }
}
```

</details>

### `model/Genre.java`

<details>
<summary>Click to view model/Genre.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum Genre {
    ACTION,
    COMEDY,
    DRAMA,
    HORROR,
    ROMANCE,
    THRILLER,
    SCI_FI,
    DOCUMENTARY,
    ANIMATION
}
```

</details>

### `model/Language.java`

<details>
<summary>Click to view model/Language.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum Language {
    ENGLISH,
    HINDI,
    TAMIL,
    TELUGU,
    KANNADA,
    MALAYALAM,
    BENGALI,
    MARATHI
}
```

</details>

### `model/Movie.java`

<details>
<summary>Click to view model/Movie.java</summary>

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

    // Getters
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
        return "Movie{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", language=" + language +
                ", genre=" + genre +
                ", rating=" + rating +
                '}';
    }
}
```

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

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
        return "Payment{" +
                "id='" + id + '\'' +
                ", bookingId='" + bookingId + '\'' +
                ", amount=" + amount +
                ", method=" + method +
                ", status=" + status +
                '}';
    }
}
```

</details>

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum PaymentMethod {
    CREDIT_CARD,
    DEBIT_CARD,
    UPI,
    NET_BANKING,
    WALLET
}
```

</details>

### `model/PaymentStatus.java`

<details>
<summary>Click to view model/PaymentStatus.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED,
    REFUNDED
}
```

</details>

### `model/PendingState.java`

<details>
<summary>Click to view model/PendingState.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class PendingState implements BookingState {
    public static final PendingState INSTANCE = new PendingState();
    private PendingState() {}

    @Override
    public BookingState confirm(Booking booking, Payment payment) {
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Cannot confirm booking -- payment status is " + payment.getStatus());
        }
        booking.setPaymentInternal(payment);
        booking.setConfirmedAtInternal(LocalDateTime.now());
        return ConfirmedState.INSTANCE;
    }

    @Override
    public BookingState cancel(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return CancelledBookingState.INSTANCE;
    }

    @Override
    public BookingState expire(Booking booking) {
        booking.setCancelledAtInternal(LocalDateTime.now());
        return ExpiredState.INSTANCE;
    }

    @Override
    public BookingStatus getStatus() { return BookingStatus.PENDING; }
}
```

</details>

### `model/Screen.java`

<details>
<summary>Click to view model/Screen.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

import java.util.ArrayList;
import java.util.List;

public class Screen {
    private final String id;
    private final String name;
    private final String theaterId;
    private List<Seat> seats;
    private final int capacity;

    public Screen(String id, String theaterId, String name, int capacity) {
        this.id = id;
        this.name = name;
        this.theaterId = theaterId;
        this.capacity = capacity;
        this.seats = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getTheaterId() { return theaterId; }
    public List<Seat> getSeats() { return seats; }
    public int getCapacity() { return capacity; }
    
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }

    @Override
    public String toString() {
        return "Screen{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", seats=" + seats.size() +
                ", capacity=" + capacity +
                '}';
    }
}
```

</details>

### `model/Seat.java`

<details>
<summary>Click to view model/Seat.java</summary>

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
        return "Seat{" +
                "id='" + id + '\'' +
                ", seatNumber='" + seatNumber + '\'' +
                ", type=" + type +
                ", price=" + price +
                '}';
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

</details>

### `model/SeatType.java`

<details>
<summary>Click to view model/SeatType.java</summary>

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

</details>

### `model/Show.java`

<details>
<summary>Click to view model/Show.java</summary>

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
        return "Show{" +
                "id='" + id + '\'' +
                ", movieId='" + movieId + '\'' +
                ", screenId='" + screenId + '\'' +
                ", startTime=" + startTime +
                '}';
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

</details>

### `model/Theater.java`

<details>
<summary>Click to view model/Theater.java</summary>

```java
package com.you.lld.problems.bookmyshow.model;

import java.util.ArrayList;
import java.util.List;

public class Theater {
    private final String id;
    private final String name;
    private final String address;
    private final City city;
    private List<Screen> screens;

    public Theater(String id, String name, String address, City city) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.screens = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public City getCity() { return city; }
    public List<Screen> getScreens() { return screens; }
    
    public void setScreens(List<Screen> screens) {
        this.screens = screens;
    }

    @Override
    public String toString() {
        return "Theater{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city=" + city +
                ", screens=" + screens.size() +
                '}';
    }
}
```

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

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
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
```

</details>

### `impl/BookingNotifier.java`

<details>
<summary>Click to view impl/BookingNotifier.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.BookingObserver;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Observer that bridges Booking state changes → NotificationStrategy delivery.
 *
 * Keeps Booking and User entities pure (no notification logic in entities -- SRP).
 * One BookingNotifier per booking, registered in the service when the booking is created.
 *
 * On each state change, inspects booking.getStatus() and routes to the appropriate
 * NotificationStrategy method for rich per-event formatting.
 */
public class BookingNotifier implements BookingObserver {

    private final User user;
    private final NotificationStrategy notificationStrategy;

    public BookingNotifier(User user, NotificationStrategy notificationStrategy) {
        this.user = user;
        this.notificationStrategy = notificationStrategy;
    }

    @Override
    public void update(Booking booking) {
        switch (booking.getStatus()) {
            case CONFIRMED:
                notificationStrategy.notifyBookingConfirmed(user, booking);
                break;
            case CANCELLED:
                notificationStrategy.notifyBookingCancelled(user, booking);
                break;
            case EXPIRED:
                notificationStrategy.notifyBookingCancelled(user, booking);
                break;
            default:
                break;
        }
    }
}
```

</details>

### `impl/DynamicPricingStrategy.java`

<details>
<summary>Click to view impl/DynamicPricingStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import com.you.lld.problems.bookmyshow.model.SeatType;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dynamic pricing strategy based on:
 * - Seat type (REGULAR < PREMIUM < VIP)
 * - Day of week (Weekend premium)
 * - Time of day (Evening premium)
 * - Occupancy (Surge pricing when > 70% full)
 */
public class DynamicPricingStrategy implements PricingStrategy {
    
    private final Currency currency;
    private final Map<SeatType, Money> basePrices;
    private final double weekendMultiplier;
    private final double eveningMultiplier;
    private final double surgePriceMultiplier;
    
    public DynamicPricingStrategy(Currency currency) {
        this.currency = currency;
        this.weekendMultiplier = 1.3; // 30% higher on weekends
        this.eveningMultiplier = 1.2; // 20% higher for evening shows
        this.surgePriceMultiplier = 1.5; // 50% surge when > 70% full
        
        // Base prices per seat type
        this.basePrices = new HashMap<>();
        this.basePrices.put(SeatType.REGULAR, Money.of(new BigDecimal("150.00"), currency));
        this.basePrices.put(SeatType.PREMIUM, Money.of(new BigDecimal("250.00"), currency));
        this.basePrices.put(SeatType.VIP, Money.of(new BigDecimal("400.00"), currency));
    }
    
    @Override
    public Money calculatePrice(Show show, List<Seat> seats) {
        Money total = Money.ofMinor(0, currency);
        
        for (Seat seat : seats) {
            Money basePrice = basePrices.getOrDefault(seat.getType(), 
                Money.of(new BigDecimal("150.00"), currency));
            
            // Apply multipliers
            double multiplier = 1.0;
            
            // Weekend pricing
            if (isWeekend(show.getStartTime())) {
                multiplier *= weekendMultiplier;
            }
            
            // Evening show pricing (after 6 PM)
            if (isEveningShow(show.getStartTime())) {
                multiplier *= eveningMultiplier;
            }
            
            // Surge pricing based on occupancy (would need occupancy info)
            // For now, applying a simple time-based surge
            
            // Calculate final price
            long multipliedAmount = (long) (basePrice.minor() * multiplier);
            Money seatPrice = Money.ofMinor(multipliedAmount, currency);
            
            total = total.plus(seatPrice);
        }
        
        return total;
    }
    
    private boolean isWeekend(LocalDateTime showTime) {
        DayOfWeek day = showTime.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }
    
    private boolean isEveningShow(LocalDateTime showTime) {
        LocalTime time = showTime.toLocalTime();
        return time.isAfter(LocalTime.of(18, 0)); // After 6 PM
    }
    
    @Override
    public String getDescription() {
        return "Dynamic Pricing (Weekend/Evening/Surge)";
    }
}
```

</details>

### `impl/EmailNotificationStrategy.java`

<details>
<summary>Click to view impl/EmailNotificationStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Email-based notification strategy.
 * In production, this would integrate with an email service (SendGrid, SES, etc.)
 */
public class EmailNotificationStrategy implements NotificationStrategy {
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Booking Confirmed - #" + booking.getId());
        System.out.println("   Body: Your booking for " + booking.getSeats().size() 
            + " seats has been confirmed.");
        System.out.println("   Amount: ₹" + booking.getTotalAmount());
        System.out.println("   Show ID: " + booking.getShowId());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Booking Cancelled - #" + booking.getId());
        System.out.println("   Body: Your booking has been cancelled successfully.");
        System.out.println("   Refund Amount: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Show Reminder - #" + booking.getId());
        System.out.println("   Body: Your show is starting soon!");
        System.out.println("   Please arrive 15 minutes early.");
        System.out.println("───────────────────────────────────────");
    }
}
```

</details>

### `impl/EnhancedBookingService.java`

<details>
<summary>Click to view impl/EnhancedBookingService.java</summary>

```java
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
```

</details>

### `impl/MultiChannelNotificationStrategy.java`

<details>
<summary>Click to view impl/MultiChannelNotificationStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Composite notification strategy that sends notifications through multiple channels.
 * Demonstrates Composite pattern for notifications.
 */
public class MultiChannelNotificationStrategy implements NotificationStrategy {
    
    private final List<NotificationStrategy> strategies;
    
    public MultiChannelNotificationStrategy() {
        this.strategies = new ArrayList<>();
    }
    
    public void addChannel(NotificationStrategy strategy) {
        strategies.add(strategy);
    }
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingConfirmed(user, booking);
        }
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingCancelled(user, booking);
        }
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingReminder(user, booking);
        }
    }
}
```

</details>

### `impl/SMSNotificationStrategy.java`

<details>
<summary>Click to view impl/SMSNotificationStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * SMS-based notification strategy.
 * In production, this would integrate with an SMS gateway (Twilio, SNS, etc.)
 */
public class SMSNotificationStrategy implements NotificationStrategy {
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Booking #" + booking.getId() + " confirmed!");
        System.out.println("   Seats: " + booking.getSeats().size() 
            + " | Amount: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Booking #" + booking.getId() + " cancelled.");
        System.out.println("   Refund: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Your show is starting soon! #" + booking.getId());
        System.out.println("───────────────────────────────────────");
    }
}
```

</details>

### `impl/SeatLockManager.java`

<details>
<summary>Click to view impl/SeatLockManager.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import java.util.*;
import java.util.concurrent.*;

/**
 * Fine-grained per-seat locking with automatic expiry.
 *
 * Concurrency approach:
 *   - ConcurrentHashMap for lock storage (no global lock)
 *   - putIfAbsent for atomic lock acquisition (avoids TOCTOU)
 *   - Sorted seat IDs to prevent deadlock when locking multiple seats
 *   - ScheduledExecutorService for auto-expiry after timeout
 *   - Rollback on partial failure (all-or-nothing semantics)
 */
public class SeatLockManager {

    private final ConcurrentHashMap<String, LockInfo> seatLocks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private static final long LOCK_TIMEOUT_MS = 300_000; // 5 minutes

    static class LockInfo {
        final String userId;
        final long expiryTime;
        final ScheduledFuture<?> unlockTask;

        LockInfo(String userId, long expiryTime, ScheduledFuture<?> task) {
            this.userId = userId;
            this.expiryTime = expiryTime;
            this.unlockTask = task;
        }

        boolean isExpired() {
            return System.currentTimeMillis() >= expiryTime;
        }
    }

    /**
     * Atomically lock multiple seats for a user.
     * Uses putIfAbsent per seat (no separate check-then-act),
     * and rolls back all acquired locks on partial failure.
     */
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        if (seatIds == null || seatIds.isEmpty()) return false;

        List<String> sorted = new ArrayList<>(seatIds);
        Collections.sort(sorted);

        long expiry = System.currentTimeMillis() + LOCK_TIMEOUT_MS;
        List<String> acquiredKeys = new ArrayList<>();

        try {
            for (String seatId : sorted) {
                String key = seatKey(showId, seatId);

                cleanExpiredLock(key);

                ScheduledFuture<?> task = scheduler.schedule(
                    () -> forceUnlock(showId, seatId),
                    LOCK_TIMEOUT_MS, TimeUnit.MILLISECONDS
                );

                LockInfo lock = new LockInfo(userId, expiry, task);
                LockInfo existing = seatLocks.putIfAbsent(key, lock);

                if (existing != null) {
                    task.cancel(false);
                    throw new IllegalStateException("Seat " + seatId + " is locked by another user");
                }
                acquiredKeys.add(key);
            }
            return true;

        } catch (Exception e) {
            for (String key : acquiredKeys) {
                LockInfo lock = seatLocks.get(key);
                if (lock != null && lock.userId.equals(userId)) {
                    lock.unlockTask.cancel(false);
                    seatLocks.remove(key, lock);
                }
            }
            return false;
        }
    }

    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            String key = seatKey(showId, seatId);
            LockInfo lock = seatLocks.get(key);
            if (lock != null && lock.userId.equals(userId)) {
                lock.unlockTask.cancel(false);
                seatLocks.remove(key, lock);
            }
        }
    }

    public boolean isLocked(String showId, String seatId) {
        String key = seatKey(showId, seatId);
        LockInfo lock = seatLocks.get(key);
        if (lock == null) return false;
        if (lock.isExpired()) {
            cleanExpiredLock(key);
            return false;
        }
        return true;
    }

    /**
     * Returns true only if the seat is locked AND owned by the given user.
     * The service uses this to verify the caller locked the seat before creating a booking.
     */
    public boolean isLockedByUser(String showId, String seatId, String userId) {
        String key = seatKey(showId, seatId);
        LockInfo lock = seatLocks.get(key);
        if (lock == null) return false;
        if (lock.isExpired()) {
            cleanExpiredLock(key);
            return false;
        }
        return lock.userId.equals(userId);
    }

    public void shutdown() {
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

    // ────────────────────── internals ──────────────────────

    private String seatKey(String showId, String seatId) {
        return showId + ":" + seatId;
    }

    private void cleanExpiredLock(String key) {
        LockInfo lock = seatLocks.get(key);
        if (lock != null && lock.isExpired()) {
            lock.unlockTask.cancel(false);
            seatLocks.remove(key, lock);
        }
    }

    private void forceUnlock(String showId, String seatId) {
        String key = seatKey(showId, seatId);
        LockInfo lock = seatLocks.remove(key);
        if (lock != null) {
            System.out.println("[SeatLockManager] Lock expired for " + seatId + " (user " + lock.userId + ")");
        }
    }
}
```

</details>

### `impl/SimplePricingStrategy.java`

<details>
<summary>Click to view impl/SimplePricingStrategy.java</summary>

```java
package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.bookmyshow.api.PricingStrategy;
import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.Seat;
import com.you.lld.problems.bookmyshow.model.SeatType;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Simple flat pricing based only on seat type.
 * No time-based or occupancy-based variations.
 */
public class SimplePricingStrategy implements PricingStrategy {
    
    private final Currency currency;
    private final Map<SeatType, Money> prices;
    
    public SimplePricingStrategy(Currency currency) {
        this.currency = currency;
        this.prices = new HashMap<>();
        
        // Flat prices per seat type
        this.prices.put(SeatType.REGULAR, Money.of(new BigDecimal("120.00"), currency));
        this.prices.put(SeatType.PREMIUM, Money.of(new BigDecimal("200.00"), currency));
        this.prices.put(SeatType.VIP, Money.of(new BigDecimal("350.00"), currency));
    }
    
    @Override
    public Money calculatePrice(Show show, List<Seat> seats) {
        Money total = Money.ofMinor(0, currency);
        
        for (Seat seat : seats) {
            Money seatPrice = prices.getOrDefault(seat.getType(), 
                Money.of(new BigDecimal("120.00"), currency));
            total = total.plus(seatPrice);
        }
        
        return total;
    }
    
    @Override
    public String getDescription() {
        return "Simple Flat Pricing";
    }
}
```

</details>

### `cache/MovieCache.java`

<details>
<summary>Click to view cache/MovieCache.java</summary>

```java
package com.you.lld.problems.bookmyshow.cache;

import com.you.lld.problems.bookmyshow.model.Movie;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

/**
 * LRU Cache for Movie entities with TTL support.
 * Movies change rarely, so we can cache them aggressively.
 * 
 * Thread-safe implementation using LinkedHashMap with access order.
 */
public class MovieCache {
    
    private final int maxSize;
    private final Duration ttl;
    private final Map<String, CacheEntry> cache;
    
    /** Public nested class so it's accessible (e.g. for serialization or tests). */
    public static final class CacheEntry {
        public final Movie movie;
        public final Instant timestamp;

        public CacheEntry(Movie movie) {
            this.movie = movie;
            this.timestamp = Instant.now();
        }

        public boolean isExpired(Duration ttl) {
            return Duration.between(timestamp, Instant.now()).compareTo(ttl) > 0;
        }
    }
    
    public MovieCache(int maxSize, Duration ttl) {
        this.maxSize = maxSize;
        this.ttl = ttl;
        
        // LinkedHashMap with access order for efficient LRU
        this.cache = Collections.synchronizedMap(
            new LinkedHashMap<String, CacheEntry>(maxSize + 1, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, CacheEntry> eldest) {
                    return size() > maxSize;
                }
            }
        );
    }
    
    /**
     * Get movie from cache.
     */
    public Optional<Movie> get(String movieId) {
        synchronized (cache) {
            CacheEntry entry = cache.get(movieId);
            
            if (entry == null) {
                return Optional.empty();
            }
            
            // Check if expired
            if (entry.isExpired(ttl)) {
                cache.remove(movieId);
                return Optional.empty();
            }
            
            // LinkedHashMap automatically updates access order on get()
            return Optional.of(entry.movie);
        }
    }
    
    /**
     * Put movie in cache.
     */
    public void put(String movieId, Movie movie) {
        synchronized (cache) {
            cache.put(movieId, new CacheEntry(movie));
            // LinkedHashMap automatically handles LRU eviction
        }
    }
    
    /**
     * Invalidate cache entry.
     */
    public void invalidate(String movieId) {
        synchronized (cache) {
            cache.remove(movieId);
        }
    }
    
    /**
     * Clear entire cache.
     */
    public void clear() {
        synchronized (cache) {
            cache.clear();
        }
    }
    
    /**
     * Get cache statistics.
     */
    public Map<String, Object> getStats() {
        synchronized (cache) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("size", cache.size());
            stats.put("maxSize", maxSize);
            stats.put("ttl", ttl.toMinutes() + " minutes");
            
            // Count expired entries
            long expiredCount = cache.values().stream()
                .filter(entry -> entry.isExpired(ttl))
                .count();
            stats.put("expiredEntries", expiredCount);
            
            return stats;
        }
    }
    
    /**
     * Remove expired entries (manual cleanup).
     */
    public int cleanupExpired() {
        synchronized (cache) {
            List<String> expiredKeys = new ArrayList<>();
            
            for (Map.Entry<String, CacheEntry> entry : cache.entrySet()) {
                if (entry.getValue().isExpired(ttl)) {
                    expiredKeys.add(entry.getKey());
                }
            }
            
            expiredKeys.forEach(cache::remove);
            return expiredKeys.size();
        }
    }
}
```

</details>

### `exceptions/BookingNotFoundException.java`

<details>
<summary>Click to view exceptions/BookingNotFoundException.java</summary>

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/PaymentFailedException.java`

<details>
<summary>Click to view exceptions/PaymentFailedException.java</summary>

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class PaymentFailedException extends RuntimeException {
    public PaymentFailedException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/SeatNotAvailableException.java`

<details>
<summary>Click to view exceptions/SeatNotAvailableException.java</summary>

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class SeatNotAvailableException extends RuntimeException {
    public SeatNotAvailableException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/ShowNotFoundException.java`

<details>
<summary>Click to view exceptions/ShowNotFoundException.java</summary>

```java
package com.you.lld.problems.bookmyshow.exceptions;

public class ShowNotFoundException extends RuntimeException {
    public ShowNotFoundException(String message) {
        super(message);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.bookmyshow.impl.BookMyShowDemo"
```
