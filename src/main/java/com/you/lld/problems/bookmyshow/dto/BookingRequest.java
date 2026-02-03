package com.you.lld.problems.bookmyshow.dto;

import java.util.List;

/**
 * DTO for booking creation request.
 * Separates API contract from domain model.
 */
public class BookingRequest {
    
    private String userId;
    private String showId;
    private List<String> seatIds;
    private String promoCode;  // Optional
    
    // Constructor
    public BookingRequest() {}
    
    public BookingRequest(String userId, String showId, List<String> seatIds) {
        this.userId = userId;
        this.showId = showId;
        this.seatIds = seatIds;
    }
    
    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getShowId() { return showId; }
    public void setShowId(String showId) { this.showId = showId; }
    
    public List<String> getSeatIds() { return seatIds; }
    public void setSeatIds(List<String> seatIds) { this.seatIds = seatIds; }
    
    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
    
    @Override
    public String toString() {
        return "BookingRequest{" +
                "userId='" + userId + '\'' +
                ", showId='" + showId + '\'' +
                ", seatIds=" + seatIds +
                ", promoCode='" + promoCode + '\'' +
                '}';
    }
}
