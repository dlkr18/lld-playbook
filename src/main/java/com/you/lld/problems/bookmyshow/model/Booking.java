package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;
import java.util.List;

public class Booking {
    private final String id;
    private final String userId;
    private final String showId;
    private final List<Seat> seats;
    private final double totalAmount;
    private final LocalDateTime bookingTime;
    private BookingStatus status;
    private Payment payment;

    public Booking(String id, String userId, String showId, List<Seat> seats, 
                   double totalAmount, LocalDateTime bookingTime) {
        this.id = id;
        this.userId = userId;
        this.showId = showId;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
        this.status = BookingStatus.PENDING;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getShowId() { return showId; }
    public List<Seat> getSeats() { return seats; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public BookingStatus getStatus() { return status; }
    public Payment getPayment() { return payment; }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    @Override
    public String toString() {
        return "Booking{id='" + id + "', userId='" + userId + "', seats=" + seats.size() + 
               ", totalAmount=" + totalAmount + ", status=" + status + '}';
    }
}
