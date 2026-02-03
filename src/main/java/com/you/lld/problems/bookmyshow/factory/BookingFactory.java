package com.you.lld.problems.bookmyshow.factory;

import com.you.lld.problems.bookmyshow.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Factory for creating Booking objects.
 * Encapsulates complex booking creation logic.
 */
public class BookingFactory {
    
    /**
     * Create a new booking with generated ID.
     */
    public static Booking createBooking(
            String userId,
            String showId,
            List<Seat> seats,
            double totalAmount) {
        
        String bookingId = generateBookingId();
        
        return new Booking(
            bookingId,
            userId,
            showId,
            seats,
            totalAmount,
            LocalDateTime.now()
        );
    }
    
    /**
     * Create booking from booking request and calculated price.
     */
    public static Booking createBookingFromRequest(
            String userId,
            String showId,
            List<Seat> selectedSeats,
            double calculatedPrice,
            String promoCode) {
        
        String bookingId = generateBookingId();
        
        Booking booking = new Booking(
            bookingId,
            userId,
            showId,
            selectedSeats,
            calculatedPrice,
            LocalDateTime.now()
        );
        
        // Can add promo code tracking in booking if needed
        return booking;
    }
    
    /**
     * Generate unique booking ID.
     * Format: BKG-{timestamp}-{random}
     */
    private static String generateBookingId() {
        long timestamp = System.currentTimeMillis();
        String random = UUID.randomUUID().toString().substring(0, 8);
        return "BKG-" + timestamp + "-" + random;
    }
    
    /**
     * Create a pending booking (initial state).
     */
    public static Booking createPendingBooking(
            String userId,
            String showId,
            List<Seat> seats,
            double totalAmount) {
        
        Booking booking = createBooking(userId, showId, seats, totalAmount);
        booking.setStatus(BookingStatus.PENDING);
        return booking;
    }
}
