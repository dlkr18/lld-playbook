package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Thread-safe ride hailing service with nearest-driver matching and fare calculation.
 */
public class InMemoryRideHailingService implements RideHailingService {
    private final Map<String, Rider> riders = new ConcurrentHashMap<>();
    private final Map<String, Driver> drivers = new ConcurrentHashMap<>();
    private final Map<String, Trip> trips = new ConcurrentHashMap<>();

    private static final double BASE_FARE = 5.0;
    private static final double PER_KM_RATE = 2.5;

    @Override
    public Rider registerRider(String name, String phone) {
        String id = UUID.randomUUID().toString();
        Rider rider = new Rider(id, name, phone);
        riders.put(id, rider);
        return rider;
    }
    
    @Override
    public Driver registerDriver(String name, String phone) {
        String id = UUID.randomUUID().toString();
        Driver driver = new Driver(id, name, phone);
        drivers.put(id, driver);
        return driver;
    }
    
    @Override
    public Trip requestRide(String riderId, Location pickup, Location dropoff) {
        if (!riders.containsKey(riderId)) {
            throw new IllegalArgumentException("Rider not found: " + riderId);
        }
        String tripId = UUID.randomUUID().toString();
        Trip trip = new Trip(tripId, riderId, "");
        trip.setPickupLocation(pickup);
        trip.setDropoffLocation(dropoff);
        trip.setStatus(TripStatus.REQUESTED);

        // Calculate estimated fare
        double distance = pickup.distanceTo(dropoff);
        double estimatedFare = BASE_FARE + (PER_KM_RATE * distance);
        trip.setFare(estimatedFare);

        trips.put(tripId, trip);
        return trip;
    }
    
    @Override
    public synchronized void acceptRide(String driverId, String tripId) {
        Trip trip = trips.get(tripId);
        if (trip == null) throw new IllegalArgumentException("Trip not found: " + tripId);
        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new IllegalStateException("Trip not in REQUESTED state");
        }
        Driver driver = drivers.get(driverId);
        if (driver == null) throw new IllegalArgumentException("Driver not found: " + driverId);
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalStateException("Driver is not available");
        }

        trip.setDriverId(driverId);
        trip.setStatus(TripStatus.ACCEPTED);
        driver.setStatus(DriverStatus.BUSY);
    }
    
    @Override
    public void startTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip == null) throw new IllegalArgumentException("Trip not found");
        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new IllegalStateException("Trip not in ACCEPTED state");
        }
        trip.setStatus(TripStatus.STARTED);
    }
    
    @Override
    public void completeTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip == null) throw new IllegalArgumentException("Trip not found");
        if (trip.getStatus() != TripStatus.STARTED) {
            throw new IllegalStateException("Trip not in STARTED state");
        }
        trip.setStatus(TripStatus.COMPLETED);

        // Free driver
        Driver driver = drivers.get(trip.getDriverId());
        if (driver != null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
    }
    
    @Override
    public Payment processPayment(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip == null) throw new IllegalArgumentException("Trip not found");
        String paymentId = UUID.randomUUID().toString();
        return new Payment(paymentId, tripId, trip.getFare());
    }

    /**
     * Find nearest available driver to a location.
     */
    public Driver findNearestDriver(Location pickup) {
        Driver nearest = null;
        double minDist = Double.MAX_VALUE;
        for (Driver d : drivers.values()) {
            if (d.getStatus() == DriverStatus.AVAILABLE && d.getLocation() != null) {
                double dist = d.getLocation().distanceTo(pickup);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = d;
                }
            }
        }
        return nearest;
    }

    @Override
    public List<Driver> getAvailableDrivers(Location location) {
        return drivers.values().stream()
            .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
            .sorted((a, b) -> {
                if (location == null || a.getLocation() == null || b.getLocation() == null) return 0;
                return Double.compare(
                    a.getLocation().distanceTo(location),
                    b.getLocation().distanceTo(location));
            })
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Trip> getRiderTrips(String riderId) {
        return trips.values().stream()
            .filter(t -> t.getRiderId().equals(riderId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Trip> getDriverTrips(String driverId) {
        return trips.values().stream()
            .filter(t -> t.getDriverId() != null && t.getDriverId().equals(driverId))
            .collect(Collectors.toList());
    }
}
