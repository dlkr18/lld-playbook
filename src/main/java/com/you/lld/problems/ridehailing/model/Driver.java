package com.you.lld.problems.ridehailing.model;

import com.you.lld.problems.ridehailing.api.NotificationService;

/**
 * Driver entity -- registered with a Vehicle, tracks location and rating.
 * Starts OFFLINE; must explicitly go online to receive ride requests.
 * Status and location are volatile for cross-thread visibility.
 *
 * Implements TripObserver to receive updates for trips they've accepted.
 * Also receives ride-request broadcasts via onRideRequested() (separate from Observer).
 */
public class Driver implements TripObserver {
    private final String driverId;
    private final String name;
    private final String phone;
    private final Vehicle vehicle;
    private volatile DriverStatus status;
    private volatile Location location;
    private double totalRatingStars;
    private int totalRatingsReceived;
    private NotificationService notificationService;

    public Driver(String id, String name, String phone, Vehicle vehicle) {
        this.driverId = id;
        this.name = name;
        this.phone = phone;
        this.vehicle = vehicle;
        this.status = DriverStatus.OFFLINE;
    }

    public void setNotificationService(NotificationService ns) {
        this.notificationService = ns;
    }

    /**
     * Trip lifecycle observer -- fired when a trip this driver is assigned to changes state.
     */
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
        sendNotification(msg);
    }

    /**
     * Broadcast: called by the service for nearby eligible drivers when a new ride is requested.
     * This is NOT part of the Trip observer -- the driver isn't subscribed yet.
     */
    public void onRideRequested(Trip trip) {
        sendNotification("New ride near you: " + trip.getPickupLocation()
                + " -> " + trip.getDropoffLocation()
                + " (" + trip.getVehicleType() + ") Est: $"
                + String.format("%.2f", trip.getEstimatedFare()));
    }

    /** Direct notification for non-state events (go online/offline, rating, etc.). */
    public void sendNotification(String message) {
        if (notificationService != null) {
            notificationService.notify(driverId, message);
        }
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
