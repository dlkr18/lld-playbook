package com.you.lld.problems.parkinglot.repository;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ParkingTicket persistence.
 * Abstracts data access layer - can be implemented with JPA, JDBC, NoSQL, etc.
 */
public interface ParkingTicketRepository {
    
    /**
     * Save a new ticket or update existing one.
     */
    ParkingTicket save(ParkingTicket ticket);
    
    /**
     * Find ticket by ID.
     */
    Optional<ParkingTicket> findById(String ticketId);
    
    /**
     * Find all active tickets (not exited).
     */
    List<ParkingTicket> findActiveTickets();
    
    /**
     * Find tickets by vehicle type.
     */
    List<ParkingTicket> findByVehicleType(VehicleType type);
    
    /**
     * Find tickets within date range.
     */
    List<ParkingTicket> findByDateRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find tickets by parking space.
     */
    Optional<ParkingTicket> findBySpaceId(String spaceId);
    
    /**
     * Find long-duration parked vehicles (for alerts).
     */
    List<ParkingTicket> findLongDurationParking(LocalDateTime threshold);
    
    /**
     * Delete a ticket.
     */
    void delete(String ticketId);
    
    /**
     * Get total revenue for date range.
     */
    double getTotalRevenue(LocalDateTime start, LocalDateTime end);
    
    /**
     * Get count by vehicle type.
     */
    long countByVehicleType(VehicleType type);
    
    /**
     * Check if vehicle is currently parked.
     */
    boolean isVehicleParked(String licensePlate);
}
