# ridehailing - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/ridehailing/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py ridehailing`.

## Project Structure (34 files)

```
ridehailing/
├── RideHailingDemo.java
├── api/NotificationService.java
├── api/RideHailingService.java
├── model/AcceptedState.java
├── model/CancelledState.java
├── model/CompletedState.java
├── model/Driver.java
├── model/DriverStatus.java
├── model/InProgressState.java
├── model/Location.java
├── model/Payment.java
├── model/PaymentStatus.java
├── model/Rating.java
├── model/RequestedState.java
├── model/Rider.java
├── model/Trip.java
├── model/TripObserver.java
├── model/TripState.java
├── model/TripStatus.java
├── model/Vehicle.java
├── model/VehicleType.java
├── impl/ConsoleNotificationService.java
├── impl/DriverNotifier.java
├── impl/InMemoryRideHailingService.java
├── impl/RiderNotifier.java
├── exceptions/DriverNotFoundException.java
├── exceptions/NoDriverAvailableException.java
├── exceptions/RiderNotFoundException.java
├── exceptions/TripNotFoundException.java
├── strategy/BasePricingStrategy.java
├── strategy/DriverMatchingStrategy.java
├── strategy/NearestDriverStrategy.java
├── strategy/PricingStrategy.java
├── strategy/SurgePricingStrategy.java
```

## Source Code

### `RideHailingDemo.java`

<details>
<summary>Click to view RideHailingDemo.java</summary>

```java
package com.you.lld.problems.ridehailing;

import com.you.lld.problems.ridehailing.impl.ConsoleNotificationService;
import com.you.lld.problems.ridehailing.impl.InMemoryRideHailingService;
import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.strategy.*;

import java.util.List;
import java.util.Optional;

public class RideHailingDemo {
    public static void main(String[] args) {
        System.out.println("=== Ride Hailing System (SDE3) ===\n");

        // Bootstrap: strategies + delivery channel
        PricingStrategy basePricing = new BasePricingStrategy();
        DriverMatchingStrategy matching = new NearestDriverStrategy();
        InMemoryRideHailingService service =
                new InMemoryRideHailingService(matching, basePricing, new ConsoleNotificationService());

        // --- 1. Registration (notification service auto-injected into entities) ---
        System.out.println("--- 1. Registration ---");
        Rider alice = service.registerRider("Alice", "555-0100");
        Rider bob = service.registerRider("Bob", "555-0200");

        Driver raj = service.registerDriver("Raj", "555-1000",
                new Vehicle("V1", "KA-01-1234", VehicleType.SEDAN, "Honda City", "White"));
        Driver priya = service.registerDriver("Priya", "555-1001",
                new Vehicle("V2", "KA-02-5678", VehicleType.SUV, "Toyota Fortuner", "Black"));
        Driver arun = service.registerDriver("Arun", "555-1002",
                new Vehicle("V3", "KA-03-9999", VehicleType.SEDAN, "Maruti Dzire", "Blue"));

        System.out.println("Riders: " + alice.getName() + ", " + bob.getName());
        System.out.println("Drivers:");
        System.out.println("  " + raj);
        System.out.println("  " + priya);
        System.out.println("  " + arun);

        // --- 2. Drivers go online (direct notification) ---
        System.out.println("\n--- 2. Drivers go online ---");
        service.goOnline(raj.getDriverId(), new Location(12.9716, 77.5946));
        service.goOnline(priya.getDriverId(), new Location(12.9800, 77.5900));
        service.goOnline(arun.getDriverId(), new Location(12.9600, 77.6100));

        // --- 3. Ride request + broadcast to nearby drivers ---
        System.out.println("\n--- 3. Ride request + driver broadcast ---");
        Location pickup = new Location(12.9750, 77.5950);
        Location dropoff = new Location(13.0350, 77.6200);
        Trip trip1 = service.requestRide(alice.getRiderId(), pickup, dropoff, VehicleType.SEDAN);
        System.out.println("Trip: " + trip1.getTripId()
                + " | est $" + String.format("%.2f", trip1.getEstimatedFare()));

        Optional<Driver> matched = service.matchDriver(pickup, VehicleType.SEDAN);
        System.out.println("Nearest SEDAN driver: "
                + matched.map(Driver::getName).orElse("none"));

        // --- 4. Accept -> Start -> Complete (Observer fires on each transition) ---
        System.out.println("\n--- 4. Trip lifecycle: Accept -> Start -> Complete ---");
        System.out.println("[accept]");
        service.acceptRide(raj.getDriverId(), trip1.getTripId());
        System.out.println("[start]");
        service.startTrip(trip1.getTripId());
        System.out.println("[complete]");
        service.completeTrip(trip1.getTripId());

        // --- 5. Payment (direct notification, not a state change) ---
        System.out.println("\n--- 5. Payment ---");
        Payment payment1 = service.processPayment(trip1.getTripId());
        System.out.println(payment1);

        // --- 6. Ratings (direct notification) ---
        System.out.println("\n--- 6. Ratings ---");
        Rating r1 = service.rateDriver(trip1.getTripId(), 5, "Great ride!");
        Rating r2 = service.rateRider(trip1.getTripId(), 4, "Polite passenger");
        System.out.println("Driver rating: " + r1);
        System.out.println("Rider rating:  " + r2);
        System.out.println("Raj avg: " + String.format("%.1f",
                service.getDriver(raj.getDriverId()).getAverageRating()) + " stars");
        System.out.println("Alice avg: " + String.format("%.1f",
                service.getRider(alice.getRiderId()).getAverageRating()) + " stars");

        // --- 7. Cancellation scenarios (Observer fires for cancel too) ---
        System.out.println("\n--- 7. Cancellation scenarios ---");

        // 7a. Cancel before accept -> no fee, only rider observes
        Trip trip2 = service.requestRide(
                bob.getRiderId(), pickup, dropoff, VehicleType.SUV);
        System.out.println("[cancel REQUESTED]");
        service.cancelTrip(trip2.getTripId(), bob.getRiderId(), "Changed my mind");
        System.out.println("Cancel REQUESTED  -> fee: $"
                + String.format("%.2f", trip2.getCancellationFee()));

        // 7b. Cancel after accept -> flat $25 fee, rider + driver both observe
        Trip trip3 = service.requestRide(
                alice.getRiderId(), pickup, dropoff, VehicleType.SEDAN);
        service.acceptRide(arun.getDriverId(), trip3.getTripId());
        System.out.println("[cancel ACCEPTED]");
        service.cancelTrip(trip3.getTripId(), alice.getRiderId(), "Found another ride");
        System.out.println("Cancel ACCEPTED   -> fee: $"
                + String.format("%.2f", trip3.getCancellationFee()));

        // --- 8. Surge pricing (Decorator pattern) ---
        System.out.println("\n--- 8. Surge pricing (1.5x multiplier) ---");
        service.setPricingStrategy(new SurgePricingStrategy(basePricing, 1.5));
        Trip trip4 = service.requestRide(
                bob.getRiderId(), pickup, dropoff, VehicleType.SEDAN);
        System.out.println("Surge fare: $" + String.format("%.2f", trip4.getEstimatedFare())
                + " (base was: $" + String.format("%.2f", trip1.getEstimatedFare()) + ")");
        service.cancelTrip(trip4.getTripId(), bob.getRiderId(), "Too expensive");
        service.setPricingStrategy(basePricing);

        // --- 9. Driver goes offline ---
        System.out.println("\n--- 9. Driver availability ---");
        service.goOffline(arun.getDriverId());
        List<Driver> available = service.getAvailableDrivers(pickup);
        System.out.println("Available drivers: " + available.size());
        for (Driver d : available) {
            System.out.println("  " + d.getName() + " - " + d.getVehicle().getType()
                    + " at " + d.getLocation());
        }

        // --- 10. Trip history ---
        System.out.println("\n--- 10. Trip history ---");
        System.out.println("Alice's trips:");
        for (Trip t : service.getRiderTrips(alice.getRiderId())) {
            System.out.println("  " + t);
        }
        System.out.println("Raj's trips:");
        for (Trip t : service.getDriverTrips(raj.getDriverId())) {
            System.out.println("  " + t);
        }

        // --- 11. Error handling (State pattern enforcement) ---
        System.out.println("\n--- 11. State pattern error handling ---");
        try {
            service.startTrip(trip1.getTripId());
        } catch (IllegalStateException e) {
            System.out.println("Start completed trip: " + e.getMessage());
        }
        try {
            service.acceptRide(raj.getDriverId(), trip2.getTripId());
        } catch (IllegalStateException e) {
            System.out.println("Accept cancelled trip: " + e.getMessage());
        }
        try {
            service.rateDriver(trip2.getTripId(), 5, "Great");
        } catch (IllegalStateException e) {
            System.out.println("Rate cancelled trip:  " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `api/NotificationService.java`

<details>
<summary>Click to view api/NotificationService.java</summary>

```java
package com.you.lld.problems.ridehailing.api;

/**
 * Observer interface for ride events (driver accepted, trip started, payment, etc.).
 * Implementations can send push notifications, SMS, or log to console.
 */
public interface NotificationService {
    void notify(String userId, String message);
}
```

</details>

### `api/RideHailingService.java`

<details>
<summary>Click to view api/RideHailingService.java</summary>

```java
package com.you.lld.problems.ridehailing.api;

import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.List;

/**
 * Ride-hailing service API:
 *
 *   Registration:  registerRider, registerDriver (with Vehicle)
 *   Availability:  goOnline, goOffline, updateDriverLocation
 *   Ride lifecycle: requestRide, acceptRide, startTrip, completeTrip, cancelTrip
 *   Payment:       processPayment
 *   Ratings:       rateDriver, rateRider
 *   Queries:       getAvailableDrivers, getRiderTrips, getDriverTrips, getTrip, getDriver, getRider
 */
public interface RideHailingService {

    // --- Registration ---
    Rider registerRider(String name, String phone);
    Driver registerDriver(String name, String phone, Vehicle vehicle);

    // --- Driver availability ---
    void goOnline(String driverId, Location location);
    void goOffline(String driverId);
    void updateDriverLocation(String driverId, Location location);

    // --- Ride lifecycle ---
    Trip requestRide(String riderId, Location pickup, Location dropoff, VehicleType vehicleType);
    void acceptRide(String driverId, String tripId);
    void startTrip(String tripId);
    void completeTrip(String tripId);
    void cancelTrip(String tripId, String cancelledBy, String reason);

    // --- Payment ---
    Payment processPayment(String tripId);

    // --- Ratings ---
    Rating rateDriver(String tripId, int stars, String comment);
    Rating rateRider(String tripId, int stars, String comment);

    // --- Queries ---
    List<Driver> getAvailableDrivers(Location location);
    List<Trip> getRiderTrips(String riderId);
    List<Trip> getDriverTrips(String driverId);
    Trip getTrip(String tripId);
    Driver getDriver(String driverId);
    Rider getRider(String riderId);
}
```

</details>

### `model/AcceptedState.java`

<details>
<summary>Click to view model/AcceptedState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * A driver has accepted the ride and is heading to pickup.
 * Valid transitions: start -> InProgress, cancel -> Cancelled.
 */
public class AcceptedState implements TripState {

    public static final AcceptedState INSTANCE = new AcceptedState();
    private AcceptedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already accepted by driver " + trip.getDriverId());
    }

    @Override
    public TripState start(Trip trip) {
        trip.setStartedAtInternal(LocalDateTime.now());
        return InProgressState.INSTANCE;
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " must be started before completing");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        trip.setCancelledByInternal(cancelledBy);
        trip.setCancellationReasonInternal(reason);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CancelledState.INSTANCE;
    }

    @Override
    public TripStatus getStatus() { return TripStatus.ACCEPTED; }

    @Override
    public String toString() { return "ACCEPTED"; }
}
```

</details>

### `model/CancelledState.java`

<details>
<summary>Click to view model/CancelledState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Terminal state -- trip was cancelled by rider or driver.
 * No further transitions allowed.
 */
public class CancelledState implements TripState {

    public static final CancelledState INSTANCE = new CancelledState();
    private CancelledState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already cancelled");
    }

    @Override
    public TripStatus getStatus() { return TripStatus.CANCELLED; }

    @Override
    public String toString() { return "CANCELLED"; }
}
```

</details>

### `model/CompletedState.java`

<details>
<summary>Click to view model/CompletedState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Terminal state -- trip finished successfully.
 * No further transitions allowed.
 */
public class CompletedState implements TripState {

    public static final CompletedState INSTANCE = new CompletedState();
    private CompletedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        throw new IllegalStateException("Trip " + trip.getTripId() + " is already completed");
    }

    @Override
    public TripStatus getStatus() { return TripStatus.COMPLETED; }

    @Override
    public String toString() { return "COMPLETED"; }
}
```

</details>

### `model/Driver.java`

<details>
<summary>Click to view model/Driver.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Driver entity -- registered with a Vehicle, tracks location and rating.
 * Starts OFFLINE; must explicitly go online to receive ride requests.
 * Status and location are volatile for cross-thread visibility.
 * Pure data entity -- notification handling is in DriverNotifier (SRP).
 */
public class Driver {
    private final String driverId;
    private final String name;
    private final String phone;
    private final Vehicle vehicle;
    private volatile DriverStatus status;
    private volatile Location location;
    private double totalRatingStars;
    private int totalRatingsReceived;

    public Driver(String id, String name, String phone, Vehicle vehicle) {
        this.driverId = id;
        this.name = name;
        this.phone = phone;
        this.vehicle = vehicle;
        this.status = DriverStatus.OFFLINE;
    }

    public void addRating(int stars) {
        this.totalRatingStars += stars;
        this.totalRatingsReceived++;
    }

    public double getAverageRating() {
        return totalRatingsReceived == 0 ? 0.0 : totalRatingStars / totalRatingsReceived;
    }

    public String getDriverId() { return driverId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public Vehicle getVehicle() { return vehicle; }
    public DriverStatus getStatus() { return status; }
    public void setStatus(DriverStatus status) { this.status = status; }
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    public int getTotalRatingsReceived() { return totalRatingsReceived; }

    @Override
    public String toString() {
        return name + " [" + status + "] " + vehicle
                + (totalRatingsReceived > 0
                    ? String.format(" (%.1f stars)", getAverageRating())
                    : " (no ratings)");
    }
}
```

</details>

### `model/DriverStatus.java`

<details>
<summary>Click to view model/DriverStatus.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum DriverStatus { AVAILABLE, BUSY, OFFLINE }
```

</details>

### `model/InProgressState.java`

<details>
<summary>Click to view model/InProgressState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Rider has been picked up and the trip is underway.
 * Valid transitions: complete -> Completed, cancel -> Cancelled (emergency).
 */
public class InProgressState implements TripState {

    public static final InProgressState INSTANCE = new InProgressState();
    private InProgressState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already in progress");
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " is already in progress");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        trip.setActualFareInternal(actualFare);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CompletedState.INSTANCE;
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        trip.setCancelledByInternal(cancelledBy);
        trip.setCancellationReasonInternal(reason);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CancelledState.INSTANCE;
    }

    @Override
    public TripStatus getStatus() { return TripStatus.IN_PROGRESS; }

    @Override
    public String toString() { return "IN_PROGRESS"; }
}
```

</details>

### `model/Location.java`

<details>
<summary>Click to view model/Location.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.util.Objects;

/**
 * Immutable GPS coordinate. Uses Euclidean distance for simplicity;
 * in production you'd use the Haversine formula.
 */
public class Location {
    private final double latitude;
    private final double longitude;

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }

    public double distanceTo(Location other) {
        double dlat = this.latitude - other.latitude;
        double dlon = this.longitude - other.longitude;
        return Math.sqrt(dlat * dlat + dlon * dlon);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Location)) return false;
        Location loc = (Location) o;
        return Double.compare(loc.latitude, latitude) == 0
                && Double.compare(loc.longitude, longitude) == 0;
    }

    @Override
    public int hashCode() { return Objects.hash(latitude, longitude); }

    @Override
    public String toString() {
        return String.format("(%.4f, %.4f)", latitude, longitude);
    }
}
```

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Payment for a completed or cancelled trip.
 * Tracks lifecycle: PENDING -> COMPLETED / FAILED / REFUNDED.
 */
public class Payment {
    private final String paymentId;
    private final String tripId;
    private final double amount;
    private final LocalDateTime createdAt;
    private PaymentStatus status;

    public Payment(String paymentId, String tripId, double amount) {
        this.paymentId = paymentId;
        this.tripId = tripId;
        this.amount = amount;
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.PENDING;
    }

    public void complete() { this.status = PaymentStatus.COMPLETED; }
    public void fail() { this.status = PaymentStatus.FAILED; }
    public void refund() { this.status = PaymentStatus.REFUNDED; }

    public String getPaymentId() { return paymentId; }
    public String getTripId() { return tripId; }
    public double getAmount() { return amount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public PaymentStatus getStatus() { return status; }

    @Override
    public String toString() {
        return "Payment[" + paymentId + "] $" + String.format("%.2f", amount)
                + " (" + status + ")";
    }
}
```

</details>

### `model/PaymentStatus.java`

<details>
<summary>Click to view model/PaymentStatus.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}
```

</details>

### `model/Rating.java`

<details>
<summary>Click to view model/Rating.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Post-trip rating from one participant to another.
 * Rider rates driver (1-5 stars) and driver rates rider.
 */
public class Rating {
    private final String id;
    private final String tripId;
    private final String fromId;
    private final String toId;
    private final int stars;
    private final String comment;
    private final LocalDateTime createdAt;

    public Rating(String id, String tripId, String fromId, String toId,
                  int stars, String comment) {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("Stars must be between 1 and 5");
        }
        this.id = id;
        this.tripId = tripId;
        this.fromId = fromId;
        this.toId = toId;
        this.stars = stars;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getTripId() { return tripId; }
    public String getFromId() { return fromId; }
    public String getToId() { return toId; }
    public int getStars() { return stars; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return stars + " stars"
                + (comment != null && !comment.isEmpty() ? " - \"" + comment + "\"" : "");
    }
}
```

</details>

### `model/RequestedState.java`

<details>
<summary>Click to view model/RequestedState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Ride has been requested by a rider, waiting for a driver to accept.
 * Valid transitions: accept -> Accepted, cancel -> Cancelled.
 */
public class RequestedState implements TripState {

    public static final RequestedState INSTANCE = new RequestedState();
    private RequestedState() {}

    @Override
    public TripState accept(Trip trip, String driverId) {
        trip.setDriverIdInternal(driverId);
        trip.setAcceptedAtInternal(LocalDateTime.now());
        return AcceptedState.INSTANCE;
    }

    @Override
    public TripState start(Trip trip) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " must be accepted before starting");
    }

    @Override
    public TripState complete(Trip trip, double actualFare) {
        throw new IllegalStateException(
                "Trip " + trip.getTripId() + " must be started before completing");
    }

    @Override
    public TripState cancel(Trip trip, String cancelledBy, String reason) {
        trip.setCancelledByInternal(cancelledBy);
        trip.setCancellationReasonInternal(reason);
        trip.setCompletedAtInternal(LocalDateTime.now());
        return CancelledState.INSTANCE;
    }

    @Override
    public TripStatus getStatus() { return TripStatus.REQUESTED; }

    @Override
    public String toString() { return "REQUESTED"; }
}
```

</details>

### `model/Rider.java`

<details>
<summary>Click to view model/Rider.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Rider entity -- tracks name, phone, and running average rating.
 * Pure data entity -- notification handling is in RiderNotifier (SRP).
 */
public class Rider {
    private final String riderId;
    private final String name;
    private final String phone;
    private double totalRatingStars;
    private int totalRatingsReceived;

    public Rider(String id, String name, String phone) {
        this.riderId = id;
        this.name = name;
        this.phone = phone;
    }

    public void addRating(int stars) {
        this.totalRatingStars += stars;
        this.totalRatingsReceived++;
    }

    public double getAverageRating() {
        return totalRatingsReceived == 0 ? 0.0 : totalRatingStars / totalRatingsReceived;
    }

    public String getRiderId() { return riderId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public int getTotalRatingsReceived() { return totalRatingsReceived; }

    @Override
    public String toString() {
        return name + (totalRatingsReceived > 0
                ? String.format(" (%.1f stars)", getAverageRating()) : "");
    }
}
```

</details>

### `model/Trip.java`

<details>
<summary>Click to view model/Trip.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Core entity representing a ride from pickup to dropoff.
 *
 * Uses the State pattern for lifecycle transitions:
 *   Requested  --accept-->    Accepted
 *   Accepted   --start-->     InProgress
 *   InProgress --complete-->  Completed
 *   Any active --cancel-->    Cancelled
 *
 * Uses the Observer pattern to notify subscribed Rider/Driver after each transition.
 * Rider is added when the trip is created; Driver is added when they accept.
 *
 * Invalid transitions throw IllegalStateException from the state objects.
 * Thread safety: mutations happen under synchronized(trip) in the service layer.
 */
public class Trip {
    private final String tripId;
    private final String riderId;
    private final Location pickup;
    private final Location dropoff;
    private final VehicleType vehicleType;
    private final LocalDateTime requestedAt;
    private final double estimatedFare;

    private TripState state;
    private String driverId;
    private LocalDateTime acceptedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private double actualFare;
    private String cancelledBy;
    private String cancellationReason;
    private double cancellationFee;

    private final List<TripObserver> observers = new CopyOnWriteArrayList<>();

    public Trip(String tripId, String riderId, Location pickup, Location dropoff,
                VehicleType vehicleType, double estimatedFare) {
        this.tripId = tripId;
        this.riderId = riderId;
        this.pickup = pickup;
        this.dropoff = dropoff;
        this.vehicleType = vehicleType;
        this.estimatedFare = estimatedFare;
        this.requestedAt = LocalDateTime.now();
        this.state = RequestedState.INSTANCE;
    }

    // --- Observer management ---

    public void addObserver(TripObserver observer) { observers.add(observer); }

    public void removeObserver(TripObserver observer) { observers.remove(observer); }

    private void notifyObservers() {
        for (TripObserver obs : observers) {
            obs.update(this);
        }
    }

    // --- State-delegated operations (fire observers after each transition) ---

    public void accept(String driverId) {
        this.state = state.accept(this, driverId);
        notifyObservers();
    }

    public void start() {
        this.state = state.start(this);
        notifyObservers();
    }

    public void complete(double actualFare) {
        this.state = state.complete(this, actualFare);
        notifyObservers();
    }

    public void cancel(String cancelledBy, String reason) {
        this.state = state.cancel(this, cancelledBy, reason);
        notifyObservers();
    }

    // --- Queries ---

    public TripStatus getStatus() { return state.getStatus(); }

    public double getDistance() { return pickup.distanceTo(dropoff); }

    // --- Package-private setters for state objects ---

    void setDriverIdInternal(String driverId) { this.driverId = driverId; }
    void setAcceptedAtInternal(LocalDateTime t) { this.acceptedAt = t; }
    void setStartedAtInternal(LocalDateTime t) { this.startedAt = t; }
    void setCompletedAtInternal(LocalDateTime t) { this.completedAt = t; }
    void setActualFareInternal(double fare) { this.actualFare = fare; }
    void setCancelledByInternal(String id) { this.cancelledBy = id; }
    void setCancellationReasonInternal(String reason) { this.cancellationReason = reason; }

    public void setCancellationFee(double fee) { this.cancellationFee = fee; }

    // --- Public getters ---

    public String getTripId() { return tripId; }
    public String getRiderId() { return riderId; }
    public String getDriverId() { return driverId; }
    public Location getPickupLocation() { return pickup; }
    public Location getDropoffLocation() { return dropoff; }
    public VehicleType getVehicleType() { return vehicleType; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public double getEstimatedFare() { return estimatedFare; }
    public double getActualFare() { return actualFare; }
    public String getCancelledBy() { return cancelledBy; }
    public String getCancellationReason() { return cancellationReason; }
    public double getCancellationFee() { return cancellationFee; }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Trip[").append(tripId).append("] ").append(getStatus());
        sb.append(" | ").append(pickup).append(" -> ").append(dropoff);
        sb.append(" | ").append(vehicleType);
        sb.append(" | est=$").append(String.format("%.2f", estimatedFare));
        if (actualFare > 0) sb.append(", actual=$").append(String.format("%.2f", actualFare));
        if (driverId != null) sb.append(" | driver=").append(driverId);
        if (cancellationReason != null) sb.append(" | cancelled: ").append(cancellationReason);
        return sb.toString();
    }
}
```

</details>

### `model/TripObserver.java`

<details>
<summary>Click to view model/TripObserver.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Observer for Trip lifecycle events.
 * Rider and Driver implement this to receive automatic updates
 * when a Trip they're subscribed to changes state.
 */
public interface TripObserver {
    void update(Trip trip);
}
```

</details>

### `model/TripState.java`

<details>
<summary>Click to view model/TripState.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * State pattern for Trip lifecycle.
 *
 *   Requested  --accept-->    Accepted
 *   Accepted   --start-->     InProgress
 *   InProgress --complete-->  Completed
 *   Requested/Accepted/InProgress --cancel-->  Cancelled
 *
 * Invalid transitions throw IllegalStateException.
 * Implementations are stateless singletons -- all mutable data lives on Trip.
 */
public interface TripState {

    TripState accept(Trip trip, String driverId);

    TripState start(Trip trip);

    TripState complete(Trip trip, double actualFare);

    TripState cancel(Trip trip, String cancelledBy, String reason);

    TripStatus getStatus();
}
```

</details>

### `model/TripStatus.java`

<details>
<summary>Click to view model/TripStatus.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

public enum TripStatus {
    REQUESTED,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED
}
```

</details>

### `model/Vehicle.java`

<details>
<summary>Click to view model/Vehicle.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

/**
 * Immutable representation of a driver's vehicle.
 */
public class Vehicle {
    private final String vehicleId;
    private final String licensePlate;
    private final VehicleType type;
    private final String model;
    private final String color;

    public Vehicle(String vehicleId, String licensePlate, VehicleType type,
                   String model, String color) {
        this.vehicleId = vehicleId;
        this.licensePlate = licensePlate;
        this.type = type;
        this.model = model;
        this.color = color;
    }

    public String getVehicleId() { return vehicleId; }
    public String getLicensePlate() { return licensePlate; }
    public VehicleType getType() { return type; }
    public String getModel() { return model; }
    public String getColor() { return color; }

    @Override
    public String toString() {
        return color + " " + model + " (" + type + ") [" + licensePlate + "]";
    }
}
```

</details>

### `model/VehicleType.java`

<details>
<summary>Click to view model/VehicleType.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum VehicleType { SEDAN, SUV, BIKE, AUTO }
```

</details>

### `impl/ConsoleNotificationService.java`

<details>
<summary>Click to view impl/ConsoleNotificationService.java</summary>

```java
package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;

public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String userId, String message) {
        System.out.println("[NOTIFY -> " + userId + "] " + message);
    }
}
```

</details>

### `impl/DriverNotifier.java`

<details>
<summary>Click to view impl/DriverNotifier.java</summary>

```java
package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.model.Trip;
import com.you.lld.problems.ridehailing.model.TripObserver;

/**
 * Observer that formats and delivers driver-appropriate notifications
 * when a Trip they've accepted changes state.
 * Keeps Driver entity pure (data only) -- SRP.
 */
public class DriverNotifier implements TripObserver {
    private final String driverId;
    private final NotificationService ns;

    public DriverNotifier(String driverId, NotificationService ns) {
        this.driverId = driverId;
        this.ns = ns;
    }

    @Override
    public void update(Trip trip) {
        String msg;
        switch (trip.getStatus()) {
            case IN_PROGRESS:
                msg = "Trip " + trip.getTripId() + " started. Navigate to "
                        + trip.getDropoffLocation();
                break;
            case COMPLETED:
                msg = "Trip " + trip.getTripId() + " completed. Earnings: $"
                        + String.format("%.2f", trip.getActualFare());
                break;
            case CANCELLED:
                msg = "Trip " + trip.getTripId() + " cancelled by "
                        + (driverId.equals(trip.getCancelledBy()) ? "you" : "rider") + ".";
                break;
            default:
                return;
        }
        ns.notify(driverId, msg);
    }
}
```

</details>

### `impl/InMemoryRideHailingService.java`

<details>
<summary>Click to view impl/InMemoryRideHailingService.java</summary>

```java
package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.api.RideHailingService;
import com.you.lld.problems.ridehailing.exceptions.*;
import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.strategy.DriverMatchingStrategy;
import com.you.lld.problems.ridehailing.strategy.PricingStrategy;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory ride-hailing service with:
 * <ul>
 *   <li>Strategy pattern for pricing (base / surge) and driver matching (nearest)</li>
 *   <li>State pattern for Trip lifecycle (Requested -> Accepted -> InProgress -> Completed / Cancelled)</li>
 *   <li>Observer pattern: RiderNotifier & DriverNotifier observe Trip state changes</li>
 *   <li>NotificationService as pluggable delivery channel (console, SMS, push)</li>
 *   <li>Fine-grained locking per Trip for state transitions</li>
 *   <li>Cancellation fee logic (no fee if REQUESTED, flat fee if ACCEPTED, full fare if IN_PROGRESS)</li>
 * </ul>
 *
 * <b>Three notification layers:</b>
 * <pre>
 *   1. Trip Observer    -- RiderNotifier/DriverNotifier.update(trip) fires on state changes
 *   2. Ride Broadcast   -- service sends directly to nearby eligible drivers via NotificationService
 *   3. Direct notify    -- service sends via NotificationService for non-state events (payment, rating)
 * </pre>
 */
public class InMemoryRideHailingService implements RideHailingService {

    private final Map<String, Rider> riders = new ConcurrentHashMap<>();
    private final Map<String, Driver> drivers = new ConcurrentHashMap<>();
    private final Map<String, Trip> trips = new ConcurrentHashMap<>();
    private final Map<String, Payment> payments = new ConcurrentHashMap<>();
    private final Map<String, Rating> ratings = new ConcurrentHashMap<>();

    private final DriverMatchingStrategy matchingStrategy;
    private volatile PricingStrategy pricingStrategy;
    private final NotificationService notificationService;

    private final AtomicLong idSeq = new AtomicLong(0);

    private static final double CANCEL_FEE_AFTER_ACCEPT = 25.0;

    public InMemoryRideHailingService(DriverMatchingStrategy matchingStrategy,
                                      PricingStrategy pricingStrategy,
                                      NotificationService notificationService) {
        this.matchingStrategy = matchingStrategy;
        this.pricingStrategy = pricingStrategy;
        this.notificationService = notificationService;
    }

    /** Swap pricing strategy at runtime (e.g. activate surge). */
    public void setPricingStrategy(PricingStrategy strategy) {
        this.pricingStrategy = strategy;
    }

    // ==================== Registration ====================

    @Override
    public Rider registerRider(String name, String phone) {
        String id = "RIDER-" + idSeq.incrementAndGet();
        Rider rider = new Rider(id, name, phone);
        riders.put(id, rider);
        return rider;
    }

    @Override
    public Driver registerDriver(String name, String phone, Vehicle vehicle) {
        String id = "DRIVER-" + idSeq.incrementAndGet();
        Driver driver = new Driver(id, name, phone, vehicle);
        drivers.put(id, driver);
        return driver;
    }

    // ==================== Driver Availability ====================

    @Override
    public void goOnline(String driverId, Location location) {
        Driver driver = requireDriver(driverId);
        driver.setLocation(location);
        driver.setStatus(DriverStatus.AVAILABLE);
        notificationService.notify(driverId, "You are now online at " + location);
    }

    @Override
    public void goOffline(String driverId) {
        Driver driver = requireDriver(driverId);
        if (driver.getStatus() == DriverStatus.BUSY) {
            throw new IllegalStateException("Cannot go offline while on an active trip");
        }
        driver.setStatus(DriverStatus.OFFLINE);
        notificationService.notify(driverId, "You are now offline");
    }

    @Override
    public void updateDriverLocation(String driverId, Location location) {
        Driver driver = requireDriver(driverId);
        driver.setLocation(location);
    }

    // ==================== Ride Lifecycle ====================

    @Override
    public Trip requestRide(String riderId, Location pickup, Location dropoff,
                            VehicleType vehicleType) {
        requireRider(riderId);

        double distance = pickup.distanceTo(dropoff);
        double estimatedFare = pricingStrategy.calculateFare(distance, vehicleType);

        String tripId = "TRIP-" + idSeq.incrementAndGet();
        Trip trip = new Trip(tripId, riderId, pickup, dropoff, vehicleType, estimatedFare);
        trips.put(tripId, trip);

        // Rider's notifier observes this trip
        trip.addObserver(new RiderNotifier(riderId, notificationService));

        notificationService.notify(riderId, "Ride requested. Estimated fare: $"
                + String.format("%.2f", estimatedFare) + " (" + vehicleType + ")");

        // Broadcast to nearby eligible drivers (not observers -- they haven't accepted yet)
        drivers.values().stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .filter(d -> d.getLocation() != null)
                .filter(d -> d.getVehicle().getType() == vehicleType)
                .sorted(Comparator.comparingDouble(d -> d.getLocation().distanceTo(pickup)))
                .forEach(d -> notificationService.notify(d.getDriverId(),
                        "New ride near you: " + pickup + " -> " + dropoff
                                + " (" + vehicleType + ") Est: $"
                                + String.format("%.2f", estimatedFare)));

        return trip;
    }

    @Override
    public void acceptRide(String driverId, String tripId) {
        Driver driver = requireDriver(driverId);
        Trip trip = requireTrip(tripId);

        synchronized (trip) {
            if (driver.getStatus() != DriverStatus.AVAILABLE) {
                throw new IllegalStateException("Driver " + driverId + " is not available");
            }
            if (driver.getVehicle().getType() != trip.getVehicleType()) {
                throw new IllegalStateException("Vehicle type mismatch: trip requires "
                        + trip.getVehicleType() + " but driver has "
                        + driver.getVehicle().getType());
            }

            // Driver's notifier subscribes before accept so it receives this + future updates
            trip.addObserver(new DriverNotifier(driverId, notificationService));

            // State: REQUESTED -> ACCEPTED, fires notifyObservers()
            trip.accept(driverId);
            driver.setStatus(DriverStatus.BUSY);
        }
    }

    @Override
    public void startTrip(String tripId) {
        Trip trip = requireTrip(tripId);

        synchronized (trip) {
            // State: ACCEPTED -> IN_PROGRESS, fires notifyObservers()
            trip.start();
        }
    }

    @Override
    public void completeTrip(String tripId) {
        Trip trip = requireTrip(tripId);
        String driverId;

        synchronized (trip) {
            double distance = trip.getDistance();
            double actualFare = pricingStrategy.calculateFare(distance, trip.getVehicleType());

            // State: IN_PROGRESS -> COMPLETED, fires notifyObservers()
            trip.complete(actualFare);
            driverId = trip.getDriverId();
        }

        Driver driver = drivers.get(driverId);
        if (driver != null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
    }

    @Override
    public void cancelTrip(String tripId, String cancelledBy, String reason) {
        Trip trip = requireTrip(tripId);
        TripStatus statusBeforeCancel;

        synchronized (trip) {
            statusBeforeCancel = trip.getStatus();

            double cancellationFee = 0.0;
            if (statusBeforeCancel == TripStatus.ACCEPTED) {
                cancellationFee = CANCEL_FEE_AFTER_ACCEPT;
            } else if (statusBeforeCancel == TripStatus.IN_PROGRESS) {
                cancellationFee = trip.getEstimatedFare();
            }
            trip.setCancellationFee(cancellationFee);

            // State: active -> CANCELLED, fires notifyObservers()
            trip.cancel(cancelledBy, reason);

            if (trip.getDriverId() != null) {
                Driver driver = drivers.get(trip.getDriverId());
                if (driver != null) {
                    driver.setStatus(DriverStatus.AVAILABLE);
                }
            }
        }
    }

    // ==================== Payment ====================

    @Override
    public Payment processPayment(String tripId) {
        Trip trip = requireTrip(tripId);

        if (trip.getStatus() != TripStatus.COMPLETED && trip.getStatus() != TripStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot process payment -- trip is " + trip.getStatus());
        }

        double amount = trip.getStatus() == TripStatus.COMPLETED
                ? trip.getActualFare()
                : trip.getCancellationFee();

        if (amount <= 0) {
            throw new IllegalStateException("No payment required for this trip");
        }

        String paymentId = "PAY-" + idSeq.incrementAndGet();
        Payment payment = new Payment(paymentId, tripId, amount);
        payment.complete();
        payments.put(paymentId, payment);

        // Direct notification (not a state change)
        notificationService.notify(trip.getRiderId(), "Payment of $"
                + String.format("%.2f", amount) + " processed for trip " + tripId);
        return payment;
    }

    // ==================== Ratings ====================

    @Override
    public Rating rateDriver(String tripId, int stars, String comment) {
        Trip trip = requireTrip(tripId);
        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new IllegalStateException("Can only rate completed trips");
        }

        String ratingId = "RAT-" + idSeq.incrementAndGet();
        Rating rating = new Rating(ratingId, tripId, trip.getRiderId(),
                trip.getDriverId(), stars, comment);
        ratings.put(ratingId, rating);

        Driver driver = drivers.get(trip.getDriverId());
        if (driver != null) {
            driver.addRating(stars);
            notificationService.notify(trip.getDriverId(), "You received a " + stars
                    + "-star rating for trip " + tripId);
        }
        return rating;
    }

    @Override
    public Rating rateRider(String tripId, int stars, String comment) {
        Trip trip = requireTrip(tripId);
        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new IllegalStateException("Can only rate completed trips");
        }

        String ratingId = "RAT-" + idSeq.incrementAndGet();
        Rating rating = new Rating(ratingId, tripId, trip.getDriverId(),
                trip.getRiderId(), stars, comment);
        ratings.put(ratingId, rating);

        Rider rider = riders.get(trip.getRiderId());
        if (rider != null) {
            rider.addRating(stars);
        }
        return rating;
    }

    // ==================== Queries ====================

    @Override
    public List<Driver> getAvailableDrivers(Location location) {
        return drivers.values().stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .filter(d -> d.getLocation() != null)
                .sorted(Comparator.comparingDouble(d -> d.getLocation().distanceTo(location)))
                .collect(Collectors.toList());
    }

    /** Convenience: find best match using the injected strategy. */
    public Optional<Driver> matchDriver(Location pickup, VehicleType vehicleType) {
        return matchingStrategy.findDriver(drivers.values(), pickup, vehicleType);
    }

    @Override
    public List<Trip> getRiderTrips(String riderId) {
        requireRider(riderId);
        return trips.values().stream()
                .filter(t -> t.getRiderId().equals(riderId))
                .collect(Collectors.toList());
    }

    @Override
    public List<Trip> getDriverTrips(String driverId) {
        requireDriver(driverId);
        return trips.values().stream()
                .filter(t -> driverId.equals(t.getDriverId()))
                .collect(Collectors.toList());
    }

    @Override
    public Trip getTrip(String tripId) { return requireTrip(tripId); }

    @Override
    public Driver getDriver(String driverId) { return requireDriver(driverId); }

    @Override
    public Rider getRider(String riderId) { return requireRider(riderId); }

    // ==================== Internal Helpers ====================

    private Driver requireDriver(String driverId) {
        Driver d = drivers.get(driverId);
        if (d == null) throw new DriverNotFoundException("Driver not found: " + driverId);
        return d;
    }

    private Rider requireRider(String riderId) {
        Rider r = riders.get(riderId);
        if (r == null) throw new RiderNotFoundException("Rider not found: " + riderId);
        return r;
    }

    private Trip requireTrip(String tripId) {
        Trip t = trips.get(tripId);
        if (t == null) throw new TripNotFoundException("Trip not found: " + tripId);
        return t;
    }
}
```

</details>

### `impl/RiderNotifier.java`

<details>
<summary>Click to view impl/RiderNotifier.java</summary>

```java
package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.model.Trip;
import com.you.lld.problems.ridehailing.model.TripObserver;

/**
 * Observer that formats and delivers rider-appropriate notifications
 * when a Trip they're part of changes state.
 * Keeps Rider entity pure (data only) -- SRP.
 */
public class RiderNotifier implements TripObserver {
    private final String riderId;
    private final NotificationService ns;

    public RiderNotifier(String riderId, NotificationService ns) {
        this.riderId = riderId;
        this.ns = ns;
    }

    @Override
    public void update(Trip trip) {
        String msg;
        switch (trip.getStatus()) {
            case ACCEPTED:
                msg = "Driver is on the way! Heading to " + trip.getPickupLocation();
                break;
            case IN_PROGRESS:
                msg = "Trip started. Heading to " + trip.getDropoffLocation();
                break;
            case COMPLETED:
                msg = "Trip completed. Fare: $" + String.format("%.2f", trip.getActualFare());
                break;
            case CANCELLED:
                String feeMsg = trip.getCancellationFee() > 0
                        ? " Fee: $" + String.format("%.2f", trip.getCancellationFee()) : "";
                msg = "Trip cancelled." + feeMsg;
                break;
            default:
                return;
        }
        ns.notify(riderId, msg);
    }
}
```

</details>

### `exceptions/DriverNotFoundException.java`

<details>
<summary>Click to view exceptions/DriverNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class DriverNotFoundException extends RuntimeException { public DriverNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/NoDriverAvailableException.java`

<details>
<summary>Click to view exceptions/NoDriverAvailableException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class NoDriverAvailableException extends RuntimeException { public NoDriverAvailableException(String m) { super(m); } }
```

</details>

### `exceptions/RiderNotFoundException.java`

<details>
<summary>Click to view exceptions/RiderNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class RiderNotFoundException extends RuntimeException { public RiderNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/TripNotFoundException.java`

<details>
<summary>Click to view exceptions/TripNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class TripNotFoundException extends RuntimeException { public TripNotFoundException(String m) { super(m); } }
```

</details>

### `strategy/BasePricingStrategy.java`

<details>
<summary>Click to view strategy/BasePricingStrategy.java</summary>

```java
package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;

/**
 * Standard pricing: base fare + per-km rate, both varying by vehicle type.
 *
 *   BIKE:  base $3 + $2/km
 *   AUTO:  base $4 + $3/km
 *   SEDAN: base $5 + $3.50/km
 *   SUV:   base $7 + $5/km
 */
public class BasePricingStrategy implements PricingStrategy {

    private static final Map<VehicleType, double[]> RATES;

    static {
        Map<VehicleType, double[]> m = new EnumMap<>(VehicleType.class);
        m.put(VehicleType.BIKE,  new double[]{3.0, 2.0});
        m.put(VehicleType.AUTO,  new double[]{4.0, 3.0});
        m.put(VehicleType.SEDAN, new double[]{5.0, 3.5});
        m.put(VehicleType.SUV,   new double[]{7.0, 5.0});
        RATES = Collections.unmodifiableMap(m);
    }

    @Override
    public double calculateFare(double distanceKm, VehicleType vehicleType) {
        double[] rates = RATES.getOrDefault(vehicleType, new double[]{5.0, 3.0});
        return Math.round((rates[0] + distanceKm * rates[1]) * 100.0) / 100.0;
    }
}
```

</details>

### `strategy/DriverMatchingStrategy.java`

<details>
<summary>Click to view strategy/DriverMatchingStrategy.java</summary>

```java
package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.Collection;
import java.util.Optional;

/**
 * Strategy for matching a ride request to an available driver.
 * Implementations can optimize for distance, rating, ETA, etc.
 */
public interface DriverMatchingStrategy {
    Optional<Driver> findDriver(Collection<Driver> drivers, Location pickup,
                                VehicleType vehicleType);
}
```

</details>

### `strategy/NearestDriverStrategy.java`

<details>
<summary>Click to view strategy/NearestDriverStrategy.java</summary>

```java
package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;

/**
 * Matches the nearest available driver whose vehicle type matches the request.
 */
public class NearestDriverStrategy implements DriverMatchingStrategy {

    @Override
    public Optional<Driver> findDriver(Collection<Driver> drivers, Location pickup,
                                       VehicleType vehicleType) {
        return drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .filter(d -> d.getLocation() != null)
                .filter(d -> d.getVehicle().getType() == vehicleType)
                .min(Comparator.comparingDouble(d -> d.getLocation().distanceTo(pickup)));
    }
}
```

</details>

### `strategy/PricingStrategy.java`

<details>
<summary>Click to view strategy/PricingStrategy.java</summary>

```java
package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

/**
 * Strategy for calculating ride fare.
 * Implementations can apply different pricing models (base, surge, time-of-day, etc.).
 */
public interface PricingStrategy {
    double calculateFare(double distanceKm, VehicleType vehicleType);
}
```

</details>

### `strategy/SurgePricingStrategy.java`

<details>
<summary>Click to view strategy/SurgePricingStrategy.java</summary>

```java
package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.VehicleType;

/**
 * Decorator that applies a surge multiplier on top of any base pricing strategy.
 * Used during high-demand periods (peak hours, rain, events).
 */
public class SurgePricingStrategy implements PricingStrategy {

    private final PricingStrategy delegate;
    private final double surgeMultiplier;

    public SurgePricingStrategy(PricingStrategy delegate, double surgeMultiplier) {
        if (surgeMultiplier < 1.0) {
            throw new IllegalArgumentException("Surge multiplier must be >= 1.0");
        }
        this.delegate = delegate;
        this.surgeMultiplier = surgeMultiplier;
    }

    @Override
    public double calculateFare(double distanceKm, VehicleType vehicleType) {
        double baseFare = delegate.calculateFare(distanceKm, vehicleType);
        return Math.round(baseFare * surgeMultiplier * 100.0) / 100.0;
    }

    public double getSurgeMultiplier() { return surgeMultiplier; }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ridehailing.RideHailingDemo"
```
