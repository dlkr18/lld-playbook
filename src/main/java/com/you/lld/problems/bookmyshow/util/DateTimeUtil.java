package com.you.lld.problems.bookmyshow.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date/time operations.
 */
public class DateTimeUtil {
    
    private static final DateTimeFormatter DATE_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = 
        DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Check if given time is weekend.
     */
    public static boolean isWeekend(LocalDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }
    
    /**
     * Check if given time is evening (after 6 PM).
     */
    public static boolean isEvening(LocalDateTime dateTime) {
        return dateTime.toLocalTime().isAfter(LocalTime.of(18, 0));
    }
    
    /**
     * Check if given time is morning (before 12 PM).
     */
    public static boolean isMorning(LocalDateTime dateTime) {
        return dateTime.toLocalTime().isBefore(LocalTime.of(12, 0));
    }
    
    /**
     * Get start of day.
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        return date.atStartOfDay();
    }
    
    /**
     * Get end of day.
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        return date.atTime(LocalTime.MAX);
    }
    
    /**
     * Calculate duration in minutes between two times.
     */
    public static long minutesBetween(LocalDateTime start, LocalDateTime end) {
        return Duration.between(start, end).toMinutes();
    }
    
    /**
     * Calculate duration in hours between two times.
     */
    public static long hoursBetween(LocalDateTime start, LocalDateTime end) {
        return Duration.between(start, end).toHours();
    }
    
    /**
     * Format date for display.
     */
    public static String formatDate(LocalDateTime dateTime) {
        return dateTime.format(DATE_FORMATTER);
    }
    
    /**
     * Format time for display.
     */
    public static String formatTime(LocalDateTime dateTime) {
        return dateTime.format(TIME_FORMATTER);
    }
    
    /**
     * Format datetime for display.
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DATETIME_FORMATTER);
    }
    
    /**
     * Check if show time is in the future.
     */
    public static boolean isFuture(LocalDateTime showTime) {
        return showTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * Check if show time is in the past.
     */
    public static boolean isPast(LocalDateTime showTime) {
        return showTime.isBefore(LocalDateTime.now());
    }
}
