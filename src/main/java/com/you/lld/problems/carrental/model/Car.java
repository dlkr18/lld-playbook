package com.you.lld.problems.carrental.model;

import java.util.Objects;

/**
 * A physical car in the fleet, bookable at a home {@link Location}.
 *
 * <p>Mostly immutable: id, plate, type and home location never change. Only
 * {@link CarStatus} is mutable (a car can be pulled for maintenance / retired).
 * Availability over a date range is NOT stored on the car — it is derived from
 * the car's reservations, so the model stays free of scheduling logic.
 */
public final class Car {
    private final String id;
    private final String licensePlate;
    private final CarType type;
    private final Location homeLocation;
    private volatile CarStatus status;

    public Car(String id, String licensePlate, CarType type, Location homeLocation) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Car id required");
        }
        if (licensePlate == null || licensePlate.trim().isEmpty()) {
            throw new IllegalArgumentException("License plate required");
        }
        if (type == null) {
            throw new IllegalArgumentException("Car type required");
        }
        if (homeLocation == null) {
            throw new IllegalArgumentException("Home location required");
        }
        this.id = id;
        this.licensePlate = licensePlate;
        this.type = type;
        this.homeLocation = homeLocation;
        this.status = CarStatus.ACTIVE;
    }

    public String getId() {
        return id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public CarType getType() {
        return type;
    }

    public Location getHomeLocation() {
        return homeLocation;
    }

    public CarStatus getStatus() {
        return status;
    }

    public void setStatus(CarStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("status required");
        }
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Car) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return type.displayName() + " " + licensePlate + " @" + homeLocation.getName();
    }
}
