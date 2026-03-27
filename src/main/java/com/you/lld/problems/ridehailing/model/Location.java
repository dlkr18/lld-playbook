package com.you.lld.problems.ridehailing.model;

import java.util.Objects;

/**
 * Immutable GPS coordinate. Uses Euclidean distance for simplicity;
 * in production you'd use the Haversine formula.
 */
public class Location {
    private final double latitude;
    private final double longitude;

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }

    public double distanceTo(Location other) {
        double dlat = this.latitude - other.latitude;
        double dlon = this.longitude - other.longitude;
        return Math.sqrt(dlat * dlat + dlon * dlon);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Location)) return false;
        Location loc = (Location) o;
        return Double.compare(loc.latitude, latitude) == 0
                && Double.compare(loc.longitude, longitude) == 0;
    }

    @Override
    public int hashCode() { return Objects.hash(latitude, longitude); }

    @Override
    public String toString() {
        return String.format("(%.4f, %.4f)", latitude, longitude);
    }
}
