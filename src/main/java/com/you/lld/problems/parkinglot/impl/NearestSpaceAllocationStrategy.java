package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Allocation strategy that picks the smallest-compatible space on the lowest floor.
 *
 * Per-vehicle-type preference list (tried in order):
 *   MOTORCYCLE  -> MOTORCYCLE, COMPACT, LARGE
 *   CAR         -> COMPACT, LARGE
 *   TRUCK / BUS -> LARGE
 *
 * Disabled-permit holders get DISABLED prepended to their list so they
 * always prefer reserved spaces over general ones.
 *
 * Tie-break within a space-type bucket: lowest floorNumber, then spaceId.
 */
public class NearestSpaceAllocationStrategy implements SpaceAllocationStrategy {

    private static final Map<VehicleType, List<SpaceType>> PREFERENCE;

    static {
        PREFERENCE = new HashMap<>();
        PREFERENCE.put(VehicleType.MOTORCYCLE,
            Arrays.asList(SpaceType.MOTORCYCLE, SpaceType.COMPACT, SpaceType.LARGE));
        PREFERENCE.put(VehicleType.CAR,
            Arrays.asList(SpaceType.COMPACT, SpaceType.LARGE));
        PREFERENCE.put(VehicleType.TRUCK,
            Arrays.asList(SpaceType.LARGE));
        PREFERENCE.put(VehicleType.BUS,
            Arrays.asList(SpaceType.LARGE));
    }

    @Override
    public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle) {
        if (availableSpaces == null || availableSpaces.isEmpty() || vehicle == null) {
            return Optional.empty();
        }

        List<SpaceType> prefs = PREFERENCE.get(vehicle.getVehicleType());
        if (prefs == null) return Optional.empty();

        if (vehicle.hasDisabledPermit()) {
            Optional<ParkingSpace> reserved = pickFromType(availableSpaces, SpaceType.DISABLED);
            if (reserved.isPresent()) return reserved;
        }

        for (SpaceType preferred : prefs) {
            Optional<ParkingSpace> picked = pickFromType(availableSpaces, preferred);
            if (picked.isPresent()) return picked;
        }
        return Optional.empty();
    }

    private Optional<ParkingSpace> pickFromType(List<ParkingSpace> spaces, SpaceType type) {
        return spaces.stream()
            .filter(s -> s.getSpaceType() == type)
            .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
                .thenComparing(ParkingSpace::getSpaceId));
    }

    @Override
    public String getDescription() {
        return "Nearest-fit allocation: smallest compatible space, lowest floor. " +
               "Disabled-permit vehicles get DISABLED spaces first.";
    }
}
