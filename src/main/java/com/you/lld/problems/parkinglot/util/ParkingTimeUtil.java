package com.you.lld.problems.parkinglot.util;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Utility class for parking time calculations.
 */
public class ParkingTimeUtil {
    
    /**
     * Calculate parking duration in hours (rounded up).
     */
    public static long calculateParkingHours(LocalDateTime entryTime, LocalDateTime exitTime) {
        long minutes = Duration.between(entryTime, exitTime).toMinutes();
        return (minutes + 59) / 60; // Round up to nearest hour
    }
    
    /**
     * Calculate parking duration in minutes.
     */
    public static long calculateParkingMinutes(LocalDateTime entryTime, LocalDateTime exitTime) {
        return Duration.between(entryTime, exitTime).toMinutes();
    }
    
    /**
     * Check if parking is within grace period (free).
     */
    public static boolean isWithinGracePeriod(LocalDateTime entryTime, LocalDateTime exitTime, Duration gracePeriod) {
        long minutes = calculateParkingMinutes(entryTime, exitTime);
        return minutes <= gracePeriod.toMinutes();
    }
    
    /**
     * Check if parking duration is long (e.g., > 24 hours).
     */
    public static boolean isLongDuration(LocalDateTime entryTime, LocalDateTime exitTime, Duration threshold) {
        Duration duration = Duration.between(entryTime, exitTime);
        return duration.compareTo(threshold) > 0;
    }
    
    /**
     * Format duration as human-readable string.
     */
    public static String formatDuration(LocalDateTime entryTime, LocalDateTime exitTime) {
        long minutes = calculateParkingMinutes(entryTime, exitTime);
        
        long hours = minutes / 60;
        long mins = minutes % 60;
        
        if (hours == 0) {
            return mins + " minutes";
        } else if (mins == 0) {
            return hours + " hours";
        } else {
            return hours + " hours " + mins + " minutes";
        }
    }
}
