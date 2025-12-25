package com.you.lld.problems.auction;
import java.time.LocalDateTime;

public class Bid {
    private final String bidId;
    private final String auctionId;
    private final String userId;
    private final double amount;
    private final LocalDateTime timestamp;
    
    public Bid(String bidId, String auctionId, String userId, double amount) {
        this.bidId = bidId;
        this.auctionId = auctionId;
        this.userId = userId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getBidId() { return bidId; }
    public String getUserId() { return userId; }
    public double getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
