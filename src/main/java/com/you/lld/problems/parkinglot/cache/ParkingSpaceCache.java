package com.you.lld.problems.parkinglot.cache;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Cache for parking space availability.
 * Improves performance by caching available spaces.
 */
public class ParkingSpaceCache {
    
    private final Map<String, ParkingSpace> allSpaces = new ConcurrentHashMap<>();
    private final Map<VehicleType, List<String>> availableByType = new ConcurrentHashMap<>();
    
    /**
     * Initialize cache with all spaces.
     */
    public synchronized void initialize(List<ParkingSpace> spaces) {
        allSpaces.clear();
        availableByType.clear();
        
        for (ParkingSpace space : spaces) {
            allSpaces.put(space.getId(), space);
            if (!space.isOccupied()) {
                addToAvailableList(space);
            }
        }
    }
    
    /**
     * Get available spaces for vehicle type.
     */
    public synchronized List<ParkingSpace> getAvailable(VehicleType type) {
        List<String> spaceIds = availableByType.getOrDefault(type, new ArrayList<>());
        
        return spaceIds.stream()
            .map(allSpaces::get)
            .filter(Objects::nonNull)
            .filter(s -> !s.isOccupied())
            .collect(Collectors.toList());
    }
    
    /**
     * Mark space as occupied (remove from available).
     */
    public synchronized void markOccupied(String spaceId) {
        ParkingSpace space = allSpaces.get(spaceId);
        if (space != null) {
            removeFromAvailableList(space);
        }
    }
    
    /**
     * Mark space as available (add to available).
     */
    public synchronized void markAvailable(String spaceId) {
        ParkingSpace space = allSpaces.get(spaceId);
        if (space != null) {
            addToAvailableList(space);
        }
    }
    
    /**
     * Get total available count for vehicle type.
     */
    public synchronized int getAvailableCount(VehicleType type) {
        List<String> spaceIds = availableByType.getOrDefault(type, new ArrayList<>());
        return (int) spaceIds.stream()
            .map(allSpaces::get)
            .filter(Objects::nonNull)
            .filter(s -> !s.isOccupied())
            .count();
    }
    
    /**
     * Clear cache.
     */
    public synchronized void clear() {
        allSpaces.clear();
        availableByType.clear();
    }
    
    /**
     * Get cache statistics.
     */
    public synchronized Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpaces", allSpaces.size());
        
        Map<VehicleType, Integer> availableCounts = new HashMap<>();
        for (VehicleType type : VehicleType.values()) {
            availableCounts.put(type, getAvailableCount(type));
        }
        stats.put("availableByType", availableCounts);
        
        return stats;
    }
    
    private void addToAvailableList(ParkingSpace space) {
        availableByType
            .computeIfAbsent(space.getVehicleType(), k -> new ArrayList<>())
            .add(space.getId());
    }
    
    private void removeFromAvailableList(ParkingSpace space) {
        List<String> spaces = availableByType.get(space.getVehicleType());
        if (spaces != null) {
            spaces.remove(space.getId());
        }
    }
}
