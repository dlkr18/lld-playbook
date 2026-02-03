package com.you.lld.problems.bookmyshow.controller;

import com.you.lld.problems.bookmyshow.dto.BookingRequest;
import com.you.lld.problems.bookmyshow.dto.BookingResponse;
import com.you.lld.problems.bookmyshow.mapper.BookingMapper;
import com.you.lld.problems.bookmyshow.model.*;
import com.you.lld.problems.bookmyshow.validator.BookingValidator;
import com.you.lld.problems.bookmyshow.api.BookingService;

import java.util.List;

/**
 * REST Controller for Booking operations.
 * Simulates Spring Boot @RestController without actual Spring dependency.
 * 
 * In production with Spring Boot:
 * @RestController
 * @RequestMapping("/api/v1/bookings")
 * @Validated
 */
public class BookingController {
    
    private final BookingService bookingService;
    private final BookingValidator validator;
    
    public BookingController(BookingService bookingService, BookingValidator validator) {
        this.bookingService = bookingService;
        this.validator = validator;
    }
    
    /**
     * POST /api/v1/bookings
     * Create a new booking.
     * 
     * @RequestMapping(method = RequestMethod.POST)
     * @ResponseStatus(HttpStatus.CREATED)
     */
    public BookingResponse createBooking(BookingRequest request) {
        // Validate request
        List<String> validationErrors = validator.validate(request);
        if (!validationErrors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + validationErrors);
        }
        
        // Lock seats first
        boolean locked = bookingService.lockSeats(
            request.getShowId(),
            request.getSeatIds(),
            request.getUserId()
        );
        
        if (!locked) {
            throw new IllegalStateException("Seats not available");
        }
        
        try {
            // Create booking
            Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getShowId(),
                request.getSeatIds()
            );
            
            // Get additional details for response
            Show show = bookingService.getShow(request.getShowId());
            
            // Convert to DTO
            return BookingMapper.toSimpleResponse(booking);
            
        } catch (Exception e) {
            // Rollback: unlock seats
            bookingService.unlockSeats(
                request.getShowId(),
                request.getSeatIds(),
                request.getUserId()
            );
            throw e;
        }
    }
    
    /**
     * GET /api/v1/bookings/{bookingId}
     * Get booking details.
     * 
     * @GetMapping("/{bookingId}")
     */
    public BookingResponse getBooking(String bookingId) {
        Booking booking = bookingService.getBooking(bookingId);
        return BookingMapper.toSimpleResponse(booking);
    }
    
    /**
     * GET /api/v1/bookings/user/{userId}
     * Get all bookings for a user.
     * 
     * @GetMapping("/user/{userId}")
     */
    public List<BookingResponse> getUserBookings(String userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return bookings.stream()
            .map(BookingMapper::toSimpleResponse)
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * POST /api/v1/bookings/{bookingId}/confirm
     * Confirm booking with payment.
     * 
     * @PostMapping("/{bookingId}/confirm")
     */
    public BookingResponse confirmBooking(String bookingId, Payment payment) {
        boolean confirmed = bookingService.confirmBooking(bookingId, payment);
        
        if (!confirmed) {
            throw new IllegalStateException("Failed to confirm booking");
        }
        
        Booking booking = bookingService.getBooking(bookingId);
        return BookingMapper.toSimpleResponse(booking);
    }
    
    /**
     * DELETE /api/v1/bookings/{bookingId}
     * Cancel a booking.
     * 
     * @DeleteMapping("/{bookingId}")
     */
    public void cancelBooking(String bookingId) {
        boolean cancelled = bookingService.cancelBooking(bookingId);
        
        if (!cancelled) {
            throw new IllegalStateException("Failed to cancel booking");
        }
    }
}
