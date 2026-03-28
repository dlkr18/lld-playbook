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
