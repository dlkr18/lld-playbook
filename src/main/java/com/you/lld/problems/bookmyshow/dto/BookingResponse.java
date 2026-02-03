package com.you.lld.problems.bookmyshow.dto;

import com.you.lld.problems.bookmyshow.model.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for booking response.
 * Contains only data needed by API consumers.
 */
public class BookingResponse {
    
    private String bookingId;
    private String userId;
    private String showId;
    private String movieTitle;
    private String theaterName;
    private String screenName;
    private LocalDateTime showTime;
    private List<SeatDTO> seats;
    private double totalAmount;
    private String currency;
    private BookingStatus status;
    private LocalDateTime bookingTime;
    private String paymentId;
    
    // Nested DTO for seat info
    public static class SeatDTO {
        private String seatNumber;
        private String seatType;
        private double price;
        
        public SeatDTO(String seatNumber, String seatType, double price) {
            this.seatNumber = seatNumber;
            this.seatType = seatType;
            this.price = price;
        }
        
        // Getters
        public String getSeatNumber() { return seatNumber; }
        public String getSeatType() { return seatType; }
        public double getPrice() { return price; }
    }
    
    // Getters and Setters
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getShowId() { return showId; }
    public void setShowId(String showId) { this.showId = showId; }
    
    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    
    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }
    
    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }
    
    public LocalDateTime getShowTime() { return showTime; }
    public void setShowTime(LocalDateTime showTime) { this.showTime = showTime; }
    
    public List<SeatDTO> getSeats() { return seats; }
    public void setSeats(List<SeatDTO> seats) { this.seats = seats; }
    
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
