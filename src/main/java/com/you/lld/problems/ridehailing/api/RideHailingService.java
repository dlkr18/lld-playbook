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
