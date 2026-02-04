package com.you.lld.problems.parkinglot.repository;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ParkingSpace persistence.
 */
public interface ParkingSpaceRepository {
    
    ParkingSpace save(ParkingSpace space);
    
    Optional<ParkingSpace> findById(String spaceId);
    
    List<ParkingSpace> findAll();
    
    /**
     * Find available spaces for vehicle type.
     */
    List<ParkingSpace> findAvailableByVehicleType(VehicleType type);
    
    /**
     * Find spaces by floor number.
     */
    List<ParkingSpace> findByFloor(int floor);
    
    /**
     * Find occupied spaces.
     */
    List<ParkingSpace> findOccupiedSpaces();
    
    /**
     * Get availability count by vehicle type.
     */
    int countAvailableByVehicleType(VehicleType type);
    
    /**
     * Get occupancy rate (percentage).
     */
    double getOccupancyRate();
    
    void delete(String spaceId);
}
