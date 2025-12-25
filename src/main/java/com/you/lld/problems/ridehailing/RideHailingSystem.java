package com.you.lld.problems.ridehailing;
import java.util.*;

public class RideHailingSystem {
    private final Map<String, Rider> riders;
    private final Map<String, Driver> drivers;
    private final Map<String, Trip> trips;
    
    public RideHailingSystem() {
        this.riders = new HashMap<>();
        this.drivers = new HashMap<>();
        this.trips = new HashMap<>();
    }
    
    public void registerRider(Rider rider) {
        riders.put(rider.getRiderId(), rider);
    }
    
    public void registerDriver(Driver driver) {
        drivers.put(driver.getDriverId(), driver);
    }
    
    public String requestRide(Trip trip) {
        trips.put(trip.getTripId(), trip);
        Driver nearestDriver = findNearestDriver(trip);
        if (nearestDriver != null) {
            trip.assignDriver(nearestDriver.getDriverId());
            trip.setStatus(Trip.TripStatus.ACCEPTED);
            nearestDriver.setStatus(Driver.DriverStatus.BUSY);
        }
        return trip.getTripId();
    }
    
    private Driver findNearestDriver(Trip trip) {
        for (Driver driver : drivers.values()) {
            if (driver.getStatus() == Driver.DriverStatus.AVAILABLE) {
                return driver; // Simplified - would use location matching
            }
        }
        return null;
    }
}
