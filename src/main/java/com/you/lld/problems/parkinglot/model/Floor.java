package com.you.lld.problems.parkinglot.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A single floor of the parking lot — owns a fixed set of ParkingSpaces.
 *
 * The space list is immutable after construction (no runtime resize).
 * Per-space occupancy mutates, but that's inside ParkingSpace.
 */
public final class Floor {

    private final int floorNumber;
    private final List<ParkingSpace> spaces;

    public Floor(int floorNumber, List<ParkingSpace> spaces) {
        if (floorNumber < 0)
            throw new IllegalArgumentException("floorNumber must be >= 0");
        Objects.requireNonNull(spaces, "spaces");
        for (ParkingSpace s : spaces) {
            if (s.getFloorNumber() != floorNumber) {
                throw new IllegalArgumentException(
                    "space " + s.getSpaceId() + " is on floor " + s.getFloorNumber() +
                    " but added to floor " + floorNumber);
            }
        }
        this.floorNumber = floorNumber;
        this.spaces = Collections.unmodifiableList(new ArrayList<>(spaces));
    }

    public int getFloorNumber() { return floorNumber; }
    public List<ParkingSpace> getSpaces() { return spaces; }

    public int size() { return spaces.size(); }

    public List<ParkingSpace> availableFor(Vehicle vehicle) {
        return spaces.stream()
            .filter(s -> s.isAvailable() && s.canAccept(vehicle))
            .collect(Collectors.toList());
    }

    public long occupiedCount() {
        return spaces.stream().filter(ParkingSpace::isOccupied).count();
    }
}
