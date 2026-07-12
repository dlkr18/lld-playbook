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
