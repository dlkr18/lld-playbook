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
 *   <li>Observer pattern: Rider & Driver observe their Trip; nearby drivers get ride-request broadcasts</li>
 *   <li>NotificationService as pluggable delivery channel (console, SMS, push)</li>
 *   <li>Fine-grained locking per Trip for state transitions</li>
 *   <li>Cancellation fee logic (no fee if REQUESTED, flat fee if ACCEPTED, full fare if IN_PROGRESS)</li>
 * </ul>
 *
 * <b>Three notification layers:</b>
 * <pre>
 *   1. Trip Observer    -- Rider/Driver.update(trip) fires automatically on state changes
 *   2. Ride Broadcast   -- driver.onRideRequested(trip) pushes to nearby eligible drivers
 *   3. Direct notify    -- entity.sendNotification(msg) for non-state events (payment, rating)
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
        rider.setNotificationService(notificationService);
        riders.put(id, rider);
        return rider;
    }

    @Override
    public Driver registerDriver(String name, String phone, Vehicle vehicle) {
        String id = "DRIVER-" + idSeq.incrementAndGet();
        Driver driver = new Driver(id, name, phone, vehicle);
        driver.setNotificationService(notificationService);
        drivers.put(id, driver);
        return driver;
    }

    // ==================== Driver Availability ====================

    @Override
    public void goOnline(String driverId, Location location) {
        Driver driver = requireDriver(driverId);
        driver.setLocation(location);
        driver.setStatus(DriverStatus.AVAILABLE);
        driver.sendNotification("You are now online at " + location);
    }

    @Override
    public void goOffline(String driverId) {
        Driver driver = requireDriver(driverId);
        if (driver.getStatus() == DriverStatus.BUSY) {
            throw new IllegalStateException("Cannot go offline while on an active trip");
        }
        driver.setStatus(DriverStatus.OFFLINE);
        driver.sendNotification("You are now offline");
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
        Rider rider = requireRider(riderId);

        double distance = pickup.distanceTo(dropoff);
        double estimatedFare = pricingStrategy.calculateFare(distance, vehicleType);

        String tripId = "TRIP-" + idSeq.incrementAndGet();
        Trip trip = new Trip(tripId, riderId, pickup, dropoff, vehicleType, estimatedFare);
        trips.put(tripId, trip);

        // Rider observes their trip (gets notified on every state change)
        trip.addObserver(rider);
        rider.sendNotification("Ride requested. Estimated fare: $"
                + String.format("%.2f", estimatedFare) + " (" + vehicleType + ")");

        // Broadcast to nearby eligible drivers
        List<Driver> candidates = drivers.values().stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .filter(d -> d.getLocation() != null)
                .filter(d -> d.getVehicle().getType() == vehicleType)
                .sorted(Comparator.comparingDouble(d -> d.getLocation().distanceTo(pickup)))
                .collect(Collectors.toList());
        for (Driver candidate : candidates) {
            candidate.onRideRequested(trip);
        }

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

            // Driver subscribes to the trip before accept so they receive this + future updates
            trip.addObserver(driver);

            // State handles: REQUESTED -> ACCEPTED (others throw)
            // This fires notifyObservers() -> rider gets "Driver on the way", driver gets nothing
            // (driver's update() doesn't handle ACCEPTED since they already know they accepted)
            trip.accept(driverId);
            driver.setStatus(DriverStatus.BUSY);
        }
    }

    @Override
    public void startTrip(String tripId) {
        Trip trip = requireTrip(tripId);

        synchronized (trip) {
            // State handles: ACCEPTED -> IN_PROGRESS (others throw)
            // Fires notifyObservers() -> rider + driver both get "Trip started" via update()
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

            // State handles: IN_PROGRESS -> COMPLETED (others throw)
            // Fires notifyObservers() -> rider + driver both get "Trip completed" via update()
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
        double cancellationFee = 0.0;
        TripStatus statusBeforeCancel;

        synchronized (trip) {
            statusBeforeCancel = trip.getStatus();

            if (statusBeforeCancel == TripStatus.ACCEPTED) {
                cancellationFee = CANCEL_FEE_AFTER_ACCEPT;
            } else if (statusBeforeCancel == TripStatus.IN_PROGRESS) {
                cancellationFee = trip.getEstimatedFare();
            }
            trip.setCancellationFee(cancellationFee);

            // State handles: any active -> CANCELLED (terminal states throw)
            // Fires notifyObservers() -> rider + driver (if assigned) get "Trip cancelled"
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

        // Payment is not a state change -- use direct notification
        Rider rider = riders.get(trip.getRiderId());
        if (rider != null) {
            rider.sendNotification("Payment of $" + String.format("%.2f", amount)
                    + " processed for trip " + tripId);
        }
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
            driver.sendNotification("You received a " + stars
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
