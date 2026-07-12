package com.you.lld.problems.parkinglot.model;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Individual parking space.
 *
 * Concurrency model:
 *   - occupied is an AtomicBoolean.
 *   - tryOccupy() uses compareAndSet() so only ONE thread wins when multiple
 *     threads race to claim the same space. No locks on the hot path.
 *   - currentVehicle is volatile; readers see the latest vehicle after a
 *     successful claim; cleared on vacate().
 *
 * Compatibility rules:
 *   - canPhysicallyFit(VehicleType) — pure size check, ignores permits.
 *   - canAccept(Vehicle)            — full rules: size + permit for DISABLED.
 *
 * Only canAccept(Vehicle) should be used to gate an actual park attempt.
 */
public final class ParkingSpace {

    private final String spaceId;
    private final SpaceType spaceType;
    private final int floorNumber;
    private final AtomicBoolean occupied = new AtomicBoolean(false);
    private volatile Vehicle currentVehicle;

    public ParkingSpace(String spaceId, SpaceType spaceType, int floorNumber) {
        if (spaceId == null || spaceId.trim().isEmpty())
            throw new IllegalArgumentException("spaceId required");
        if (floorNumber < 0)
            throw new IllegalArgumentException("floorNumber must be >= 0");
        this.spaceId = spaceId;
        this.spaceType = Objects.requireNonNull(spaceType, "spaceType");
        this.floorNumber = floorNumber;
    }

    /**
     * Atomic claim. Returns true if this thread won the race.
     * Called by the service after allocation strategy selects this space.
     */
    public boolean tryOccupy(Vehicle vehicle) {
        Objects.requireNonNull(vehicle, "vehicle");
        if (!canAccept(vehicle)) return false;
        if (occupied.compareAndSet(false, true)) {
            this.currentVehicle = vehicle;
            return true;
        }
        return false;
    }

    /** Release the space. Safe to call when already free (no-op). */
    public Vehicle vacate() {
        Vehicle v = this.currentVehicle;
        this.currentVehicle = null;
        occupied.set(false);
        return v;
    }

    /** Size-only check: can this space's dimensions hold this vehicle type? */
    public boolean canPhysicallyFit(VehicleType type) {
        return spaceType.canAccommodate(type);
    }

    /** Full rules: physical fit AND permit check for DISABLED spaces. */
    public boolean canAccept(Vehicle vehicle) {
        if (vehicle == null) return false;
        if (!canPhysicallyFit(vehicle.getVehicleType())) return false;
        if (spaceType == SpaceType.DISABLED && !vehicle.hasDisabledPermit()) return false;
        return true;
    }

    public String getSpaceId()       { return spaceId; }
    public SpaceType getSpaceType()  { return spaceType; }
    public int getFloorNumber()      { return floorNumber; }
    public boolean isOccupied()      { return occupied.get(); }
    public boolean isAvailable()     { return !occupied.get(); }
    public Vehicle getCurrentVehicle() { return currentVehicle; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParkingSpace)) return false;
        return spaceId.equals(((ParkingSpace) o).spaceId);
    }
    @Override public int hashCode() { return spaceId.hashCode(); }
    @Override public String toString() {
        return "ParkingSpace{" + spaceId + "," + spaceType + ",floor=" + floorNumber +
               ",occupied=" + isOccupied() + "}";
    }
}
