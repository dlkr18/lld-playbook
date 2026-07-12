package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.*;
import com.you.lld.problems.ridehailing.model.VehicleType;

import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;

/**
 * Matches the nearest available driver whose vehicle type matches the request.
 */
public class NearestDriverStrategy implements DriverMatchingStrategy {

    @Override
    public Optional<Driver> findDriver(Collection<Driver> drivers, Location pickup,
                                       VehicleType vehicleType) {
        return drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .filter(d -> d.getLocation() != null)
                .filter(d -> d.getVehicle().getType() == vehicleType)
                .min(Comparator.comparingDouble(d -> d.getLocation().distanceTo(pickup)));
    }
}
