package com.you.lld.problems.bookmyshow.validator;

import com.you.lld.problems.bookmyshow.dto.BookingRequest;

import java.util.ArrayList;
import java.util.List;

/**
 * Validator for booking requests.
 * Validates business rules before processing.
 */
public class BookingValidator {
    
    private static final int MAX_SEATS_PER_BOOKING = 10;
    private static final int MIN_SEATS_PER_BOOKING = 1;
    
    /**
     * Validate booking request.
     * @return List of validation errors (empty if valid)
     */
    public List<String> validate(BookingRequest request) {
        List<String> errors = new ArrayList<>();
        
        // Validate user ID
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            errors.add("User ID is required");
        }
        
        // Validate show ID
        if (request.getShowId() == null || request.getShowId().trim().isEmpty()) {
            errors.add("Show ID is required");
        }
        
        // Validate seat IDs
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            errors.add("At least one seat must be selected");
        } else {
            // Check seat count limits
            if (request.getSeatIds().size() < MIN_SEATS_PER_BOOKING) {
                errors.add("Minimum " + MIN_SEATS_PER_BOOKING + " seat(s) required");
            }
            if (request.getSeatIds().size() > MAX_SEATS_PER_BOOKING) {
                errors.add("Maximum " + MAX_SEATS_PER_BOOKING + " seats allowed per booking");
            }
            
            // Check for duplicate seats
            long uniqueSeats = request.getSeatIds().stream().distinct().count();
            if (uniqueSeats != request.getSeatIds().size()) {
                errors.add("Duplicate seat IDs not allowed");
            }
            
            // Check for null/empty seat IDs
            boolean hasInvalidSeats = request.getSeatIds().stream()
                .anyMatch(id -> id == null || id.trim().isEmpty());
            if (hasInvalidSeats) {
                errors.add("Seat IDs cannot be null or empty");
            }
        }
        
        // Validate promo code format (if provided)
        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            if (!isValidPromoCode(request.getPromoCode())) {
                errors.add("Invalid promo code format");
            }
        }
        
        return errors;
    }
    
    /**
     * Check if booking request is valid.
     */
    public boolean isValid(BookingRequest request) {
        return validate(request).isEmpty();
    }
    
    /**
     * Validate promo code format.
     */
    private boolean isValidPromoCode(String promoCode) {
        // Example: Promo codes should be 6-12 alphanumeric characters
        return promoCode.matches("^[A-Z0-9]{6,12}$");
    }
    
    /**
     * Validate seat adjacency (optional business rule).
     * Ensures selected seats are adjacent for better user experience.
     */
    public boolean areSeatsAdjacent(List<String> seatIds) {
        // Example implementation for seat numbers like "A1", "A2", "A3"
        if (seatIds.size() <= 1) {
            return true;
        }
        
        // Extract row and numbers
        char firstRow = seatIds.get(0).charAt(0);
        
        // All seats should be in same row
        boolean sameRow = seatIds.stream()
            .allMatch(s -> s.charAt(0) == firstRow);
        
        if (!sameRow) {
            return false;
        }
        
        // Check if seat numbers are consecutive
        List<Integer> seatNumbers = seatIds.stream()
            .map(s -> Integer.parseInt(s.substring(1)))
            .sorted()
            .collect(java.util.stream.Collectors.toList());
        
        for (int i = 1; i < seatNumbers.size(); i++) {
            if (seatNumbers.get(i) != seatNumbers.get(i-1) + 1) {
                return false; // Not consecutive
            }
        }
        
        return true;
    }
}
