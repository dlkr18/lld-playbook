package com.you.lld.problems.parkinglot.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Composite root: ParkingLot -> Floor -> ParkingSpace.
 *
 * The lot's structure (floors, spaces) is fixed after construction; only
 * occupancy state on individual spaces is mutable.
 *
 * Query helpers here are read-only and never mutate state — the Service
 * decides what to do with the returned candidates.
 */
public final class ParkingLot {

    private final String lotId;
    private final String name;
    private final List<Floor> floors;
    private final List<ParkingSpace> allSpaces;

    public ParkingLot(String lotId, String name, List<Floor> floors) {
        if (lotId == null || lotId.trim().isEmpty())
            throw new IllegalArgumentException("lotId required");
        if (name == null || name.trim().isEmpty())
            throw new IllegalArgumentException("name required");
        Objects.requireNonNull(floors, "floors");
        if (floors.isEmpty())
            throw new IllegalArgumentException("lot must have at least one floor");
        this.lotId = lotId;
        this.name = name;
        this.floors = Collections.unmodifiableList(new ArrayList<>(floors));

        List<ParkingSpace> flat = new ArrayList<>();
        for (Floor f : floors) flat.addAll(f.getSpaces());
        this.allSpaces = Collections.unmodifiableList(flat);
    }

    public String getLotId()           { return lotId; }
    public String getName()            { return name; }
    public List<Floor> getFloors()     { return floors; }
    public List<ParkingSpace> getAllSpaces() { return allSpaces; }
    public int totalSpaces()           { return allSpaces.size(); }

    /** All spaces across all floors currently available for this vehicle. */
    public List<ParkingSpace> availableFor(Vehicle vehicle) {
        return allSpaces.stream()
            .filter(s -> s.isAvailable() && s.canAccept(vehicle))
            .collect(Collectors.toList());
    }

    public long occupiedCount() {
        return allSpaces.stream().filter(ParkingSpace::isOccupied).count();
    }
}
