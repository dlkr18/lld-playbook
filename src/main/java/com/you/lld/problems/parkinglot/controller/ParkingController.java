package com.you.lld.problems.parkinglot.controller;

import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.dto.ParkingRequest;
import com.you.lld.problems.parkinglot.dto.ParkingResponse;
import com.you.lld.problems.parkinglot.mapper.ParkingMapper;
import com.you.lld.problems.parkinglot.model.*;
import com.you.lld.problems.parkinglot.validator.ParkingValidator;

import java.time.LocalDateTime;

/**
 * REST Controller for Parking operations.
 * Simulates Spring Boot @RestController.
 * 
 * In production with Spring Boot:
 * @RestController
 * @RequestMapping("/api/v1/parking")
 */
public class ParkingController {
    
    private final ParkingService parkingService;
    private final ParkingValidator validator;
    
    public ParkingController(ParkingService parkingService, ParkingValidator validator) {
        this.parkingService = parkingService;
        this.validator = validator;
    }
    
    /**
     * POST /api/v1/parking/entry
     * Vehicle entry - park a vehicle.
     * 
     * @PostMapping("/entry")
     * @ResponseStatus(HttpStatus.CREATED)
     */
    public ParkingResponse parkVehicle(ParkingRequest request) {
        // Validate request
        var errors = validator.validate(request);
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + errors);
        }
        
        // Normalize license plate
        String normalizedPlate = validator.normalizeLicensePlate(request.getLicensePlate());
        
        // Create vehicle
        Vehicle vehicle = new Vehicle(normalizedPlate, request.getVehicleType());
        
        // Park vehicle
        ParkingTicket ticket = parkingService.enterVehicle(vehicle);
        
        // Convert to DTO
        return ParkingMapper.toResponse(ticket);
    }
    
    /**
     * POST /api/v1/parking/exit/{ticketId}
     * Vehicle exit - process payment and release space.
     * 
     * @PostMapping("/exit/{ticketId}")
     */
    public ParkingResponse exitVehicle(String ticketId) {
        // Exit vehicle
        Payment payment = parkingService.exitVehicle(ticketId);
        
        // Get updated ticket
        // (In real implementation, would query repository)
        ParkingTicket ticket = createTicketFromPayment(ticketId, payment);
        
        // Convert to DTO
        return ParkingMapper.toResponse(ticket);
    }
    
    /**
     * GET /api/v1/parking/ticket/{ticketId}
     * Get ticket details.
     * 
     * @GetMapping("/ticket/{ticketId}")
     */
    public ParkingResponse getTicket(String ticketId) {
        // Would query from repository in real implementation
        throw new UnsupportedOperationException("Not implemented - needs repository integration");
    }
    
    /**
     * GET /api/v1/parking/availability
     * Get parking availability.
     * 
     * @GetMapping("/availability")
     */
    public OccupancyReport getAvailability() {
        return parkingService.getOccupancyReport();
    }
    
    /**
     * GET /api/v1/parking/availability/{vehicleType}
     * Check availability for specific vehicle type.
     * 
     * @GetMapping("/availability/{vehicleType}")
     */
    public boolean checkAvailability(VehicleType vehicleType) {
        return parkingService.checkAvailability(vehicleType);
    }
    
    /**
     * Helper to create ticket from payment (temporary).
     * In real implementation, would fetch from repository.
     */
    private ParkingTicket createTicketFromPayment(String ticketId, Payment payment) {
        // This is a placeholder - in real implementation,
        // would query ticket from repository
        Vehicle vehicle = new Vehicle("TEMP", VehicleType.CAR);
        ParkingSpace space = new ParkingSpace("TEMP", 1, VehicleType.CAR);
        ParkingTicket ticket = new ParkingTicket(
            ticketId,
            vehicle,
            space,
            LocalDateTime.now().minusHours(2)
        );
        ticket.setExitTime(LocalDateTime.now());
        ticket.setPayment(payment);
        return ticket;
    }
}
