package com.you.lld.problems.ridehailing;

import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.impl.*;
import com.you.lld.problems.ridehailing.model.*;

public class RideHailingDemo {
    public static void main(String[] args) {
        System.out.println("=== Ride Hailing System Demo ===\n");
        
        RideHailingService service = new InMemoryRideHailingService();
        
        // Register rider and driver
        Rider rider = service.registerRider("Alice", "555-0100");
        Driver driver = service.registerDriver("Bob", "555-0200");
        
        System.out.println("✅ Registered rider: " + rider.getName());
        System.out.println("✅ Registered driver: " + driver.getName());
        
        // Request a ride
        Location pickup = new Location(40.7, -74.0);
        Location dropoff = new Location(40.8, -74.1);
        Trip trip = service.requestRide(rider.getRiderId(), pickup, dropoff);
        
        System.out.println("\n📱 Ride requested");
        System.out.println("   Pickup: " + pickup);
        System.out.println("   Dropoff: " + dropoff);
        
        // Driver accepts and starts trip
        service.acceptRide(driver.getDriverId(), trip.getTripId());
        System.out.println("\n✅ Driver accepted the ride");
        
        service.startTrip(trip.getTripId());
        System.out.println("🚗 Trip started");
        
        service.completeTrip(trip.getTripId());
        System.out.println("🏁 Trip completed");
        
        // Process payment
        Payment payment = service.processPayment(trip.getTripId());
        System.out.println("\n💳 Payment processed");
        System.out.println("   Fare: $" + payment.getAmount());
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}