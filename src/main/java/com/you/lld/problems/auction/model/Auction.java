package com.you.lld.problems.auction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Auction {
    private final String id;
    private final String itemId;
    private final String sellerId;
    private final BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private AuctionStatus status;
    private String winningBidderId;
    private final List<Bid> bids;
    
    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.currentPrice = startingPrice;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = AuctionStatus.SCHEDULED;
        this.bids = new ArrayList<>();
    }
    
    public synchronized boolean placeBid(Bid bid) {
        if (status != AuctionStatus.ACTIVE) {
            return false;
        }
        
        if (bid.getAmount().compareTo(currentPrice) <= 0) {
            return false;
        }
        
        bids.add(bid);
        currentPrice = bid.getAmount();
        winningBidderId = bid.getBidderId();
        return true;
    }
    
    public void start() {
        this.status = AuctionStatus.ACTIVE;
    }
    
    public void end() {
        this.status = AuctionStatus.COMPLETED;
    }
    
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == AuctionStatus.ACTIVE && now.isBefore(endTime);
    }
    
    public String getId() { return id; }
    public String getItemId() { return itemId; }
    public String getSellerId() { return sellerId; }
    public BigDecimal getStartingPrice() { return startingPrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public AuctionStatus getStatus() { return status; }
    public String getWinningBidderId() { return winningBidderId; }
    public List<Bid> getBids() { return new ArrayList<>(bids); }
    
    @Override
    public String toString() {
        return "Auction{id='" + id + "', currentPrice=" + currentPrice + 
               ", bids=" + bids.size() + ", status=" + status + "}";
    }
}
