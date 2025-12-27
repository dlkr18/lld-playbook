package com.you.lld.problems.auction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Bid {
    private final String id;
    private final String auctionId;
    private final String bidderId;
    private final BigDecimal amount;
    private final LocalDateTime timestamp;
    private BidStatus status;
    
    public Bid(String id, String auctionId, String bidderId, BigDecimal amount) {
        this.id = id;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.status = BidStatus.PENDING;
    }
    
    public void accept() { this.status = BidStatus.ACCEPTED; }
    public void reject() { this.status = BidStatus.REJECTED; }
    public void win() { this.status = BidStatus.WINNING; }
    
    public String getId() { return id; }
    public String getAuctionId() { return auctionId; }
    public String getBidderId() { return bidderId; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public BidStatus getStatus() { return status; }
    
    @Override
    public String toString() {
        return "Bid{id='" + id + "', bidderId='" + bidderId + "', amount=" + amount + 
               ", status=" + status + "}";
    }
}
