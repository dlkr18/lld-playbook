package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Post-trip rating from one participant to another.
 * Rider rates driver (1-5 stars) and driver rates rider.
 */
public class Rating {
    private final String id;
    private final String tripId;
    private final String fromId;
    private final String toId;
    private final int stars;
    private final String comment;
    private final LocalDateTime createdAt;

    public Rating(String id, String tripId, String fromId, String toId,
                  int stars, String comment) {
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("Stars must be between 1 and 5");
        }
        this.id = id;
        this.tripId = tripId;
        this.fromId = fromId;
        this.toId = toId;
        this.stars = stars;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getTripId() { return tripId; }
    public String getFromId() { return fromId; }
    public String getToId() { return toId; }
    public int getStars() { return stars; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return stars + " stars"
                + (comment != null && !comment.isEmpty() ? " - \"" + comment + "\"" : "");
    }
}
