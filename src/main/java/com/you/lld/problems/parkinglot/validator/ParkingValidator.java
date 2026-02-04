package com.you.lld.problems.parkinglot.validator;

import com.you.lld.problems.parkinglot.dto.ParkingRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validator for parking requests.
 */
public class ParkingValidator {
    
    private static final Pattern LICENSE_PLATE_PATTERN = 
        Pattern.compile("^[A-Z0-9-]{4,15}$");
    
    /**
     * Validate parking entry request.
     */
    public List<String> validate(ParkingRequest request) {
        List<String> errors = new ArrayList<>();
        
        // Validate license plate
        if (request.getLicensePlate() == null || 
            request.getLicensePlate().trim().isEmpty()) {
            errors.add("License plate is required");
        } else if (!isValidLicensePlate(request.getLicensePlate())) {
            errors.add("Invalid license plate format");
        }
        
        // Validate vehicle type
        if (request.getVehicleType() == null) {
            errors.add("Vehicle type is required");
        }
        
        // Validate preferred floor (if specified)
        if (request.getPreferredFloor() < -1 || request.getPreferredFloor() > 10) {
            errors.add("Invalid floor number (must be -1 for any, or 0-10)");
        }
        
        return errors;
    }
    
    /**
     * Check if request is valid.
     */
    public boolean isValid(ParkingRequest request) {
        return validate(request).isEmpty();
    }
    
    /**
     * Validate license plate format.
     * Supports formats like: AB-1234, KA01AB1234, DL-12-AB-1234
     */
    private boolean isValidLicensePlate(String licensePlate) {
        if (licensePlate == null) return false;
        String normalized = licensePlate.toUpperCase().replaceAll("\\s+", "");
        return LICENSE_PLATE_PATTERN.matcher(normalized).matches();
    }
    
    /**
     * Normalize license plate (uppercase, remove spaces).
     */
    public String normalizeLicensePlate(String licensePlate) {
        if (licensePlate == null) return null;
        return licensePlate.toUpperCase().replaceAll("\\s+", "");
    }
}
