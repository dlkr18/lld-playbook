package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryRideHailingService implements RideHailingService {
    private Map<String, Rider> riders = new HashMap<>();
    private Map<String, Driver> drivers = new HashMap<>();
    private Map<String, Trip> trips = new HashMap<>();
    
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
        String tripId = UUID.randomUUID().toString();
        Trip trip = new Trip(tripId, riderId, "");
        trip.setPickupLocation(pickup);
        trip.setDropoffLocation(dropoff);
        trip.setStatus(TripStatus.REQUESTED);
        trips.put(tripId, trip);
        return trip;
    }
    
    @Override
    public void acceptRide(String driverId, String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setDriverId(driverId);
            trip.setStatus(TripStatus.ACCEPTED);
        }
    }
    
    @Override
    public void startTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setStatus(TripStatus.STARTED);
        }
    }
    
    @Override
    public void completeTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setStatus(TripStatus.COMPLETED);
        }
    }
    
    @Override
    public Payment processPayment(String tripId) {
        String paymentId = UUID.randomUUID().toString();
        return new Payment(paymentId, tripId, 25.50);
    }
    
    @Override
    public List<Driver> getAvailableDrivers(Location location) {
        return drivers.values().stream()
            .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
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