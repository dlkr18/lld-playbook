package com.you.lld.problems.bookmyshow.repository;

import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Booking persistence.
 * Abstracts data access layer - can be implemented with JPA, JDBC, NoSQL, etc.
 */
public interface BookingRepository {
    
    /**
     * Save a new booking or update existing one.
     */
    Booking save(Booking booking);
    
    /**
     * Find booking by ID.
     */
    Optional<Booking> findById(String bookingId);
    
    /**
     * Find all bookings for a user.
     */
    List<Booking> findByUserId(String userId);
    
    /**
     * Find all bookings for a show.
     */
    List<Booking> findByShowId(String showId);
    
    /**
     * Find bookings by status.
     */
    List<Booking> findByStatus(BookingStatus status);
    
    /**
     * Find bookings within date range.
     */
    List<Booking> findByDateRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find expired pending bookings that need cleanup.
     */
    List<Booking> findExpiredPendingBookings(LocalDateTime expiryThreshold);
    
    /**
     * Delete a booking (soft or hard delete).
     */
    void delete(String bookingId);
    
    /**
     * Get total revenue for a date range.
     */
    double getTotalRevenue(LocalDateTime start, LocalDateTime end);
    
    /**
     * Get booking count by status.
     */
    long countByStatus(BookingStatus status);
    
    /**
     * Check if user has active booking for show.
     */
    boolean hasActiveBookingForShow(String userId, String showId);
}
