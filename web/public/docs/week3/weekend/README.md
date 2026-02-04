# Weekend 3: BookMyShow — Ticket Booking System 🎬

**Project**: Build a movie ticket booking system with seat holds, overbooking prevention, and pricing tiers.

---

## 🎯 **Project Goals**

- Apply Week 3 concepts: Rate limiting, caching, distributed state
- Implement seat reservation with timeouts
- Prevent overbooking with optimistic locking
- Handle high-concurrency flash sales

---

## 📋 **Requirements**

### **Functional**
1. Browse movies by city, theater, date
2. View available shows and seats
3. Reserve seats temporarily (5-min hold)
4. Complete booking with payment
5. Cancel bookings with refund policies

### **Non-Functional**
- Handle 10,000 concurrent booking attempts
- Seat selection < 100ms response
- Zero overbooking tolerance
- Payment processing reliability

---

## 🏗️ **Domain Model**

```java
public class Movie {
    private final MovieId id;
    private final String title;
    private final Duration duration;
    private final String genre;
    private final Rating rating;
    private final List<Cast> cast;
}

public class Theater {
    private final TheaterId id;
    private final String name;
    private final Address address;
    private final List<Screen> screens;
}

public class Screen {
    private final ScreenId id;
    private final String name;
    private final int totalSeats;
    private final SeatLayout layout;
}

public class Show {
    private final ShowId id;
    private final Movie movie;
    private final Screen screen;
    private final LocalDateTime startTime;
    private final Map<SeatType, Money> pricing;
}

public class Seat {
    private final SeatId id;
    private final String row;
    private final int number;
    private final SeatType type;
}

public class Booking {
    private final BookingId id;
    private final Show show;
    private final List<Seat> seats;
    private final User user;
    private final Money totalAmount;
    private final BookingStatus status;
    private final Instant createdAt;
    private final Instant expiresAt;
}
```

---

## 🔒 **Seat Locking Strategy**

### **Optimistic Locking with Version**

```java
public class SeatAvailability {
    private final ShowId showId;
    private final SeatId seatId;
    private SeatStatus status;
    private BookingId heldBy;
    private Instant holdExpiresAt;
    private long version;  // Optimistic locking
    
    public enum SeatStatus {
        AVAILABLE, HELD, BOOKED
    }
}

public class SeatReservationService {
    
    private final SeatAvailabilityRepository repository;
    private final Duration holdDuration = Duration.ofMinutes(5);
    
    @Transactional
    public HoldResult holdSeats(ShowId showId, List<SeatId> seatIds, UserId userId) {
        List<SeatAvailability> seats = repository.findByShowIdAndSeatIds(showId, seatIds);
        
        // Check all seats available
        for (SeatAvailability seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                if (seat.getStatus() == SeatStatus.HELD && 
                    seat.getHoldExpiresAt().isBefore(Instant.now())) {
                    // Hold expired, can reclaim
                    continue;
                }
                throw new SeatNotAvailableException(seat.getSeatId());
            }
        }
        
        // Create booking hold
        BookingId holdId = BookingId.generate();
        Instant expiresAt = Instant.now().plus(holdDuration);
        
        for (SeatAvailability seat : seats) {
            seat.setStatus(SeatStatus.HELD);
            seat.setHeldBy(holdId);
            seat.setHoldExpiresAt(expiresAt);
            repository.save(seat);  // Version check happens here
        }
        
        return new HoldResult(holdId, expiresAt, calculateTotal(seats));
    }
    
    @Transactional
    public Booking confirmBooking(BookingId holdId, PaymentDetails payment) {
        List<SeatAvailability> seats = repository.findByHoldId(holdId);
        
        // Verify hold is still valid
        for (SeatAvailability seat : seats) {
            if (seat.getStatus() != SeatStatus.HELD || 
                !seat.getHeldBy().equals(holdId)) {
                throw new HoldExpiredException(holdId);
            }
            if (seat.getHoldExpiresAt().isBefore(Instant.now())) {
                throw new HoldExpiredException(holdId);
            }
        }
        
        // Process payment
        PaymentResult result = paymentService.process(payment);
        if (!result.isSuccess()) {
            throw new PaymentFailedException(result.getError());
        }
        
        // Confirm seats
        for (SeatAvailability seat : seats) {
            seat.setStatus(SeatStatus.BOOKED);
            repository.save(seat);
        }
        
        return createBooking(holdId, seats, payment);
    }
}
```

---

## ⏰ **Hold Expiration Cleanup**

```java
@Scheduled(fixedRate = 60000)  // Every minute
public void cleanupExpiredHolds() {
    Instant now = Instant.now();
    List<SeatAvailability> expiredHolds = repository.findExpiredHolds(now);
    
    for (SeatAvailability seat : expiredHolds) {
        seat.setStatus(SeatStatus.AVAILABLE);
        seat.setHeldBy(null);
        seat.setHoldExpiresAt(null);
        repository.save(seat);
    }
    
    log.info("Cleaned up {} expired holds", expiredHolds.size());
}
```

---

## 📊 **Dynamic Pricing**

```java
public interface PricingStrategy {
    Money calculatePrice(Seat seat, Show show);
}

public class DynamicPricingStrategy implements PricingStrategy {
    
    @Override
    public Money calculatePrice(Seat seat, Show show) {
        Money basePrice = show.getPricing().get(seat.getType());
        
        // Time-based surge
        double surgeFactor = calculateSurgeFactor(show);
        
        // Demand-based pricing
        double demandFactor = calculateDemandFactor(show);
        
        // Weekend premium
        double weekendFactor = isWeekend(show.getStartTime()) ? 1.2 : 1.0;
        
        return basePrice.multiply(surgeFactor * demandFactor * weekendFactor);
    }
    
    private double calculateSurgeFactor(Show show) {
        Duration timeToShow = Duration.between(Instant.now(), show.getStartTime());
        
        if (timeToShow.toHours() < 2) return 1.5;  // Last 2 hours
        if (timeToShow.toHours() < 24) return 1.2; // Last day
        return 1.0;
    }
    
    private double calculateDemandFactor(Show show) {
        double occupancy = getOccupancyRate(show);
        
        if (occupancy > 0.8) return 1.3;  // High demand
        if (occupancy < 0.3) return 0.8;  // Low demand discount
        return 1.0;
    }
}
```

---

## 📁 **Code Location**

```
[View BookMyShow Implementation](/problems/bookmyshow/README)
├── api/
│   ├── BookingService.java
│   ├── SearchService.java
│   └── PricingStrategy.java
├── model/
│   ├── Movie.java
│   ├── Theater.java
│   ├── Show.java
│   ├── Seat.java
│   └── Booking.java
├── impl/
│   ├── SeatReservationService.java
│   ├── DynamicPricingStrategy.java
│   └── HoldCleanupService.java
└── repository/
    ├── MovieRepository.java
    └── SeatAvailabilityRepository.java
```

---

## ✅ **Acceptance Criteria**

- [ ] Search movies by city/theater/date
- [ ] View seat availability in real-time
- [ ] Hold seats for 5 minutes
- [ ] Complete booking with payment
- [ ] No double booking (overbooking prevention)
- [ ] Expired holds auto-release
- [ ] Dynamic pricing based on demand

---

**Next Week**: [Week 4 - Advanced Cases](week4/README.md) →
