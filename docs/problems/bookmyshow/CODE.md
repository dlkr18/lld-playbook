# BookMyShow - Movie Ticket Booking 🎬

Production-ready **movie ticket booking system** with **seat reservation**, **payment processing**, **concurrent booking handling**, and **overbooking prevention**. Critical real-time reservation system.

---

## 🎯 **Core Features**

✅ **Multi-City, Multi-Theater** - Theaters across cities  
✅ **Show Management** - Movies, shows, timings  
✅ **Seat Selection** - Interactive seat map  
✅ **Reservation & Locking** - Prevent double booking  
✅ **Payment Processing** - Multiple payment methods  
✅ **Concurrency Control** - Handle simultaneous bookings  

---

## 📚 **System Architecture**

### **1. Domain Model**

```
City
 └── Theater
      └── Screen
           └── Show
                └── Seat (with booking status)
                     └── Booking
```

### **2. Seat States**

```java
public enum SeatStatus {
    AVAILABLE,      // Can be booked
    LOCKED,         // Temporarily held (5 min timeout)
    BOOKED,         // Payment successful
    BLOCKED         // Maintenance/reserved
}
```

### **3. Booking Flow**

```
1. Browse → 2. Select Show → 3. Choose Seats
     ↓
4. Lock Seats (5 min) → 5. Payment → 6. Confirm
     ↓ (timeout)
Release Seats (back to AVAILABLE)
```

---

## 💻 **Key Components**

### **Concurrency Control with Pessimistic Locking:**

```java
public class BookingService {
    
    /**
     * Locks seats for a user session.
     * Uses database-level locking to prevent double booking.
     */
    @Transactional
    public Booking lockSeats(ShowId showId, List<SeatId> seatIds, UserId userId) {
        // SELECT ... FOR UPDATE (database lock)
        List<Seat> seats = seatRepository.findAndLockSeats(showId, seatIds);
        
        // Verify all seats are available
        for (Seat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new SeatUnavailableException(seat.getId());
            }
        }
        
        // Lock seats (set 5-minute expiry)
        Booking booking = new Booking(userId, showId, seats, Instant.now().plusSeconds(300));
        for (Seat seat : seats) {
            seat.lock(booking.getId());
        }
        
        seatRepository.saveAll(seats);
        return bookingRepository.save(booking);
    }
    
    /**
     * Confirms booking after successful payment.
     */
    @Transactional
    public void confirmBooking(BookingId bookingId, PaymentId paymentId) {
        Booking booking = bookingRepository.findById(bookingId);
        
        if (booking.hasExpired()) {
            throw new BookingExpiredException();
        }
        
        booking.confirm(paymentId);
        
        // Update seats to BOOKED
        List<Seat> seats = seatRepository.findByBookingId(bookingId);
        for (Seat seat : seats) {
            seat.book();
        }
        
        seatRepository.saveAll(seats);
        bookingRepository.save(booking);
    }
}
```

---

## 🔒 **Preventing Double Booking**

### **Strategy 1: Pessimistic Locking (Recommended)**
```sql
-- Database-level lock
SELECT * FROM seats 
WHERE show_id = ? AND seat_id IN (...)
FOR UPDATE;

-- No other transaction can read/modify these rows
-- until current transaction commits
```

### **Strategy 2: Optimistic Locking**
```java
@Entity
public class Seat {
    @Version
    private Long version;
    
    // When updating, check:
    // UPDATE seats SET status = 'LOCKED', version = version + 1
    // WHERE id = ? AND version = ?
    
    // If version mismatch → retry or fail
}
```

### **Strategy 3: Distributed Lock (Redis)**
```java
public class RedisLockService {
    
    public boolean tryLock(String seatKey, long timeoutSeconds) {
        return redisTemplate.opsForValue()
            .setIfAbsent(seatKey, "locked", timeoutSeconds, TimeUnit.SECONDS);
    }
    
    public void unlock(String seatKey) {
        redisTemplate.delete(seatKey);
    }
}
```

---

## ⏰ **Timeout & Cleanup**

```java
/**
 * Background job to release expired seat locks.
 */
@Scheduled(fixedRate = 60000) // Run every minute
public void releaseExpiredLocks() {
    Instant now = Instant.now();
    
    List<Booking> expired = bookingRepository
        .findByStatusAndLockExpiryBefore(BookingStatus.LOCKED, now);
    
    for (Booking booking : expired) {
        // Release seats
        List<Seat> seats = seatRepository.findByBookingId(booking.getId());
        for (Seat seat : seats) {
            seat.release();
        }
        seatRepository.saveAll(seats);
        
        // Mark booking as expired
        booking.expire();
        bookingRepository.save(booking);
        
        logger.info("Released expired booking: {}", booking.getId());
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Book Tickets**

```java
BookMyShowService bms = new BookMyShowService();

// 1. Search for shows
List<Show> shows = bms.searchShows(
    cityId("bangalore"),
    "Avengers: Endgame",
    LocalDate.now()
);

// 2. Select show and seats
ShowId showId = shows.get(0).getId();
List<SeatId> selectedSeats = Arrays.asList(
    seatId("A10"), seatId("A11"), seatId("A12")
);

// 3. Lock seats (starts 5-min timer)
Booking booking = bms.lockSeats(showId, selectedSeats, userId);

// 4. Process payment
Payment payment = paymentService.process(
    booking.getTotalAmount(),
    PaymentMethod.CREDIT_CARD
);

// 5. Confirm booking
bms.confirmBooking(booking.getId(), payment.getId());

// 6. Send confirmation email/SMS
notificationService.sendBookingConfirmation(booking);
```

### **Example 2: Handle Timeout**

```java
try {
    Booking booking = bms.lockSeats(showId, seats, userId);
    
    // User takes too long to pay (> 5 minutes)
    Thread.sleep(6 * 60 * 1000);
    
    // Try to confirm after expiry
    bms.confirmBooking(booking.getId(), paymentId);
    
} catch (BookingExpiredException e) {
    // Seats were released, show error
    System.err.println("Booking expired. Please try again.");
}
```

---

## 🎯 **Design Patterns**

- **State**: Booking lifecycle (LOCKED → CONFIRMED → COMPLETED)
- **Strategy**: Different pricing strategies (weekend, holiday, premium)
- **Factory**: Create bookings for different show types
- **Observer**: Notify on booking confirmation
- **Template Method**: Different cancellation policies

---

## 📊 **Performance Optimization**

### **Seat Map Caching:**
```java
@Cacheable(value = "seatMaps", key = "#showId")
public SeatMap getSeatMap(ShowId showId) {
    // Cache seat layout (rarely changes)
    // Only seat availability fetched in real-time
}
```

### **Read Replicas for Search:**
```java
// Use read replica for searching shows (eventual consistency OK)
@ReadOnly
public List<Show> searchShows(CityId cityId, String movie, LocalDate date) {
    return showRepository.findByCityAndMovieAndDate(cityId, movie, date);
}
```

---

## 🔗 **Related Resources**

- [Weekend 3: BookMyShow Project](week3/weekend/README.md)
- [Day 10: Caching](week2/day10/README.md)
- [State Pattern](foundations/DESIGN_PATTERNS_CATALOG.md)

---

**Implementation Guide**: Placeholder for future implementation in `src/main/java/com/you/lld/problems/bookmyshow/`

---

✨ **Critical booking system with race condition handling!** 🎬

