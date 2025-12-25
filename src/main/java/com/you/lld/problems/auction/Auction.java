package com.you.lld.problems.auction;
import java.time.LocalDateTime;
import java.util.*;

public class Auction {
    public enum AuctionStatus { ACTIVE, CLOSED }
    
    private final String auctionId;
    private final String itemId;
    private double startingPrice;
    private AuctionStatus status;
    private List<Bid> bids;
    private LocalDateTime endTime;
    
    public Auction(String auctionId, String itemId, double startingPrice, LocalDateTime endTime) {
        this.auctionId = auctionId;
        this.itemId = itemId;
        this.startingPrice = startingPrice;
        this.status = AuctionStatus.ACTIVE;
        this.bids = new ArrayList<>();
        this.endTime = endTime;
    }
    
    public boolean placeBid(Bid bid) {
        if (status != AuctionStatus.ACTIVE || LocalDateTime.now().isAfter(endTime)) {
            return false;
        }
        if (bid.getAmount() <= getCurrentPrice()) {
            return false;
        }
        bids.add(bid);
        return true;
    }
    
    public double getCurrentPrice() {
        return bids.isEmpty() ? startingPrice : bids.get(bids.size() - 1).getAmount();
    }
    
    public Bid getWinningBid() {
        return bids.isEmpty() ? null : bids.get(bids.size() - 1);
    }
    
    public void close() {
        this.status = AuctionStatus.CLOSED;
    }
}
