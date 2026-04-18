package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.util.List;
import java.util.Optional;

/**
 * Simple strategy: pick the first space in the provided list.
 *
 * Useful when the caller has already sorted/filtered the candidates
 * or when you don't want smart fitting — e.g., valets who park wherever.
 *
 * Still respects the disabled-permit reservation: disabled vehicles
 * prefer DISABLED spaces; regular vehicles skip DISABLED spaces
 * (the service already filtered using ParkingSpace.canAccept).
 */
public class FirstAvailableAllocationStrategy implements SpaceAllocationStrategy {

    @Override
    public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle) {
        if (availableSpaces == null || availableSpaces.isEmpty() || vehicle == null) {
            return Optional.empty();
        }
        if (vehicle.hasDisabledPermit()) {
            Optional<ParkingSpace> reserved = availableSpaces.stream()
                .filter(s -> s.getSpaceType() == SpaceType.DISABLED)
                .findFirst();
            if (reserved.isPresent()) return reserved;
        }
        return Optional.of(availableSpaces.get(0));
    }

    @Override
    public String getDescription() {
        return "First-available allocation: picks the first compatible space in iteration order.";
    }
}
