package com.you.lld.problems.parkinglot.util;

import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Utility class for vehicle operations.
 */
public class VehicleUtil {
    
    /**
     * Normalize license plate (uppercase, remove spaces).
     */
    public static String normalizeLicensePlate(String licensePlate) {
        if (licensePlate == null) return null;
        return licensePlate.toUpperCase().replaceAll("\\s+", "");
    }
    
    /**
     * Check if vehicle can fit in space type.
     * Motorcycle can use any space, but Car cannot use Motorcycle space.
     */
    public static boolean canParkInSpace(VehicleType vehicleType, VehicleType spaceType) {
        // Exact match
        if (vehicleType == spaceType) {
            return true;
        }
        
        // Motorcycle can only park in MOTORCYCLE or larger spaces
        if (vehicleType == VehicleType.MOTORCYCLE) {
            return true; // Can park in any space
        }
        
        // Car can park in CAR, TRUCK, or BUS spaces
        if (vehicleType == VehicleType.CAR) {
            return spaceType == VehicleType.CAR || 
                   spaceType == VehicleType.TRUCK || 
                   spaceType == VehicleType.BUS;
        }
        
        // Truck can park in TRUCK or BUS spaces
        if (vehicleType == VehicleType.TRUCK) {
            return spaceType == VehicleType.TRUCK || 
                   spaceType == VehicleType.BUS;
        }
        
        // Bus can only park in BUS spaces
        return false;
    }
    
    /**
     * Get display name for vehicle type.
     */
    public static String getDisplayName(VehicleType type) {
        switch (type) {
            case MOTORCYCLE:
                return "Motorcycle";
            case CAR:
                return "Car";
            case TRUCK:
                return "Truck";
            case BUS:
                return "Bus";
            default:
                return type.toString();
        }
    }
    
    /**
     * Create vehicle with normalized license plate.
     */
    public static Vehicle createVehicle(String licensePlate, VehicleType type) {
        String normalized = normalizeLicensePlate(licensePlate);
        return new Vehicle(normalized, type);
    }
}
