package com.you.lld.problems.ridehailing.model;

import com.you.lld.problems.ridehailing.api.NotificationService;

/**
 * Rider entity -- tracks name, phone, and running average rating.
 * Implements TripObserver to receive automatic updates when their trip changes state.
 * Uses an injected NotificationService as the delivery channel (console, SMS, push, etc.).
 */
public class Rider implements TripObserver {
    private final String riderId;
    private final String name;
    private final String phone;
    private double totalRatingStars;
    private int totalRatingsReceived;
    private NotificationService notificationService;

    public Rider(String id, String name, String phone) {
        this.riderId = id;
        this.name = name;
        this.phone = phone;
    }

    public void setNotificationService(NotificationService ns) {
        this.notificationService = ns;
    }

    @Override
    public void update(Trip trip) {
        String msg;
        switch (trip.getStatus()) {
            case ACCEPTED:
                msg = "Driver is on the way! Heading to " + trip.getPickupLocation();
                break;
            case IN_PROGRESS:
                msg = "Trip started. Heading to " + trip.getDropoffLocation();
                break;
            case COMPLETED:
                msg = "Trip completed. Fare: $" + String.format("%.2f", trip.getActualFare());
                break;
            case CANCELLED:
                String feeMsg = trip.getCancellationFee() > 0
                        ? " Fee: $" + String.format("%.2f", trip.getCancellationFee()) : "";
                msg = "Trip cancelled." + feeMsg;
                break;
            default:
                return;
        }
        sendNotification(msg);
    }

    /** Direct notification for non-state events (payment, rating, etc.). */
    public void sendNotification(String message) {
        if (notificationService != null) {
            notificationService.notify(riderId, message);
        }
    }

    public void addRating(int stars) {
        this.totalRatingStars += stars;
        this.totalRatingsReceived++;
    }

    public double getAverageRating() {
        return totalRatingsReceived == 0 ? 0.0 : totalRatingStars / totalRatingsReceived;
    }

    public String getRiderId() { return riderId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public int getTotalRatingsReceived() { return totalRatingsReceived; }

    @Override
    public String toString() {
        return name + (totalRatingsReceived > 0
                ? String.format(" (%.1f stars)", getAverageRating()) : "");
    }
}
