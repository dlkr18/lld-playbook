package com.you.lld.problems.ridehailing.strategy;

import com.you.lld.problems.ridehailing.model.*;

import java.util.Collection;
import java.util.Optional;

/**
 * Strategy for matching a ride request to an available driver.
 * Implementations can optimize for distance, rating, ETA, etc.
 */
public interface DriverMatchingStrategy {
    Optional<Driver> findDriver(Collection<Driver> drivers, Location pickup,
                                VehicleType vehicleType);
}
