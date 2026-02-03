package com.you.lld.problems.bookmyshow.mapper;

import com.you.lld.problems.bookmyshow.dto.BookingResponse;
import com.you.lld.problems.bookmyshow.model.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Booking domain model and DTOs.
 * Follows the Mapper pattern for clean separation of concerns.
 */
public class BookingMapper {
    
    /**
     * Convert Booking entity to BookingResponse DTO.
     */
    public static BookingResponse toResponse(
            Booking booking, 
            Show show, 
            Movie movie, 
            Theater theater, 
            Screen screen) {
        
        BookingResponse response = new BookingResponse();
        
        // Basic booking info
        response.setBookingId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setShowId(booking.getShowId());
        response.setStatus(booking.getStatus());
        response.setBookingTime(booking.getBookingTime());
        response.setTotalAmount(booking.getTotalAmount());
        response.setCurrency("INR");
        
        // Show details
        if (show != null) {
            response.setShowTime(show.getStartTime());
        }
        
        // Movie details
        if (movie != null) {
            response.setMovieTitle(movie.getTitle());
        }
        
        // Theater details
        if (theater != null) {
            response.setTheaterName(theater.getName());
        }
        
        // Screen details
        if (screen != null) {
            response.setScreenName(screen.getName());
        }
        
        // Seat details
        List<BookingResponse.SeatDTO> seatDTOs = booking.getSeats().stream()
            .map(seat -> new BookingResponse.SeatDTO(
                seat.getSeatNumber(),
                seat.getType().toString(),
                seat.getPrice()
            ))
            .collect(Collectors.toList());
        response.setSeats(seatDTOs);
        
        // Payment details
        if (booking.getPayment() != null) {
            response.setPaymentId(booking.getPayment().getId());
        }
        
        return response;
    }
    
    /**
     * Convert Booking entity to simplified DTO (for listings).
     */
    public static BookingResponse toSimpleResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setShowId(booking.getShowId());
        response.setStatus(booking.getStatus());
        response.setBookingTime(booking.getBookingTime());
        response.setTotalAmount(booking.getTotalAmount());
        response.setCurrency("INR");
        
        // Simplified seat info (just count)
        List<BookingResponse.SeatDTO> seatDTOs = booking.getSeats().stream()
            .map(seat -> new BookingResponse.SeatDTO(
                seat.getSeatNumber(),
                seat.getType().toString(),
                seat.getPrice()
            ))
            .collect(Collectors.toList());
        response.setSeats(seatDTOs);
        
        return response;
    }
}
