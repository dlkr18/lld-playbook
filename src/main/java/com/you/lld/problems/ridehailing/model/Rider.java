package com.you.lld.problems.ridehailing.model;

/**
 * Rider entity -- tracks name, phone, and running average rating.
 */
public class Rider {
    private final String riderId;
    private final String name;
    private final String phone;
    private double totalRatingStars;
    private int totalRatingsReceived;

    public Rider(String id, String name, String phone) {
        this.riderId = id;
        this.name = name;
        this.phone = phone;
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
