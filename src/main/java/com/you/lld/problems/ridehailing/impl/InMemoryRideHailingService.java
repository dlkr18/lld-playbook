package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.api.RideHailingService;
import com.you.lld.problems.ridehailing.exceptions.*;
import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.strategy.DriverMatchingStrategy;
import com.you.lld.problems.ridehailing.strategy.PricingStrategy;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory ride-hailing service with:
 * <ul>
 *   <li>Strategy pattern for pricing (base / surge) and driver matching (nearest)</li>
 *   <li>State pattern for Trip lifecycle (Requested -> Accepted -> InProgress -> Completed / Cancelled)</li>
 *   <li>Fine-grained locking per Trip for state transitions</li>
 *   <li>Observer pattern for notifications</li>
 *   <li>Rating system with running averages on Driver and Rider</li>
 *   <li>Cancellation fee logic (no fee if REQUESTED, flat fee if ACCEPTED, full fare if IN_PROGRESS)</li>
 * </ul>
 */
public class InMemoryRideHailingService implements RideHailingService {

    private final Map<String, Rider> riders = new ConcurrentHashMap<>();
    private final Map<String, Driver> drivers = new ConcurrentHashMap<>();
    private final Map<String, Trip> trips = new ConcurrentHashMap<>();
    private final Map<String, Payment> payments = new ConcurrentHashMap<>();
    private final Map<String, Rating> ratings = new ConcurrentHashMap<>();

    private final DriverMatchingStrategy matchingStrategy;
    private volatile PricingStrategy pricingStrategy;
    private final List<NotificationService> notifiers = new CopyOnWriteArrayList<>();

    private final AtomicLong idSeq = new AtomicLong(0);

    private static final double CANCEL_FEE_AFTER_ACCEPT = 25.0;

    public InMemoryRideHailingService(DriverMatchingStrategy matchingStrategy,
                                      PricingStrategy pricingStrategy) {
        this.matchingStrategy = matchingStrategy;
        this.pricingStrategy = pricingStrategy;
    }

    public void addNotifier(NotificationService notifier) {
        notifiers.add(notifier);
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
        notifyUser(driverId, "You are now online at " + location);
    }

    @Override
    public void goOffline(String driverId) {
        Driver driver = requireDriver(driverId);
        if (driver.getStatus() == DriverStatus.BUSY) {
            throw new IllegalStateException("Cannot go offline while on an active trip");
        }
        driver.setStatus(DriverStatus.OFFLINE);
        notifyUser(driverId, "You are now offline");
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

        notifyUser(riderId, "Ride requested. Estimated fare: $"
                + String.format("%.2f", estimatedFare) + " (" + vehicleType + ")");

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

            // State handles: REQUESTED -> ACCEPTED (others throw)
            trip.accept(driverId);
            driver.setStatus(DriverStatus.BUSY);
        }

        notifyUser(trip.getRiderId(), "Driver " + driver.getName()
                + " accepted your ride in a " + driver.getVehicle());
        notifyUser(driverId, "You accepted trip " + tripId
                + ". Heading to pickup at " + trip.getPickupLocation());
    }

    @Override
    public void startTrip(String tripId) {
        Trip trip = requireTrip(tripId);

        synchronized (trip) {
            // State handles: ACCEPTED -> IN_PROGRESS (others throw)
            trip.start();
        }

        notifyUser(trip.getRiderId(), "Trip started. Heading to "
                + trip.getDropoffLocation());
        notifyUser(trip.getDriverId(), "Trip " + tripId + " started.");
    }

    @Override
    public void completeTrip(String tripId) {
        Trip trip = requireTrip(tripId);
        double actualFare;
        String driverId;

        synchronized (trip) {
            double distance = trip.getDistance();
            actualFare = pricingStrategy.calculateFare(distance, trip.getVehicleType());

            // State handles: IN_PROGRESS -> COMPLETED (others throw)
            trip.complete(actualFare);
            driverId = trip.getDriverId();
        }

        Driver driver = drivers.get(driverId);
        if (driver != null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }

        notifyUser(trip.getRiderId(), "Trip completed. Fare: $"
                + String.format("%.2f", actualFare));
        notifyUser(driverId, "Trip " + tripId + " completed. Earnings: $"
                + String.format("%.2f", actualFare));
    }

    @Override
    public void cancelTrip(String tripId, String cancelledBy, String reason) {
        Trip trip = requireTrip(tripId);
        double cancellationFee = 0.0;
        TripStatus statusBeforeCancel;

        synchronized (trip) {
            statusBeforeCancel = trip.getStatus();

            // State handles: any active -> CANCELLED (terminal states throw)
            trip.cancel(cancelledBy, reason);

            if (statusBeforeCancel == TripStatus.ACCEPTED) {
                cancellationFee = CANCEL_FEE_AFTER_ACCEPT;
            } else if (statusBeforeCancel == TripStatus.IN_PROGRESS) {
                cancellationFee = trip.getEstimatedFare();
            }
            trip.setCancellationFee(cancellationFee);

            if (trip.getDriverId() != null) {
                Driver driver = drivers.get(trip.getDriverId());
                if (driver != null) {
                    driver.setStatus(DriverStatus.AVAILABLE);
                }
            }
        }

        String feeMsg = cancellationFee > 0
                ? " Cancellation fee: $" + String.format("%.2f", cancellationFee) : "";
        notifyUser(trip.getRiderId(), "Trip " + tripId + " cancelled." + feeMsg);
        if (trip.getDriverId() != null) {
            notifyUser(trip.getDriverId(), "Trip " + tripId + " cancelled by "
                    + (cancelledBy.equals(trip.getRiderId()) ? "rider" : "you") + "." + feeMsg);
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

        notifyUser(trip.getRiderId(), "Payment of $" + String.format("%.2f", amount)
                + " processed for trip " + tripId);
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
            notifyUser(trip.getDriverId(), "You received a " + stars
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

    private void notifyUser(String userId, String message) {
        for (NotificationService ns : notifiers) {
            ns.notify(userId, message);
        }
    }
}
