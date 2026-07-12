package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.util.List;
import java.util.Optional;

/**
 * Strategy for picking one ParkingSpace from the set currently available
 * and compatible with a given Vehicle.
 *
 * The service pre-filters to compatible-and-available spaces so the strategy
 * only decides policy — not validity. Strategies MUST NOT mutate space state;
 * the service performs the atomic claim via ParkingSpace.tryOccupy().
 *
 * Takes the full Vehicle (not just VehicleType) so a strategy can use
 * attributes like hasDisabledPermit() for preference.
 */
public interface SpaceAllocationStrategy {

    Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle);

    String getDescription();
}
