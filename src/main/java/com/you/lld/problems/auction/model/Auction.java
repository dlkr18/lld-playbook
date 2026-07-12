package com.you.lld.problems.auction.model;

import com.you.lld.problems.auction.state.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Auction aggregate with State-pattern lifecycle and synchronized bid placement.
 */
public class Auction {
    private final String id;
    private final String itemId;
    private final String sellerId;
    private final BigDecimal startingPrice;
    private final BigDecimal bidIncrement;
    private BigDecimal currentPrice;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private AuctionState state;
    private String winningBidderId;
    private final List<Bid> bids;

    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   LocalDateTime startTime, LocalDateTime endTime) {
        this(id, itemId, sellerId, startingPrice, new BigDecimal("1.00"), startTime, endTime);
    }

    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   BigDecimal bidIncrement, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.bidIncrement = bidIncrement;
        this.currentPrice = startingPrice;
        this.startTime = startTime;
        this.endTime = endTime;
        this.state = new ScheduledAuctionState();
        this.bids = new ArrayList<Bid>();
    }

    public synchronized void transitionTo(AuctionState newState) {
        this.state = newState;
    }

    public synchronized void recordAcceptedBid(Bid bid) {
        bids.add(bid);
        currentPrice = bid.getAmount();
        winningBidderId = bid.getBidderId();
        for (Bid b : bids) {
            if (!b.getId().equals(bid.getId()) && b.getBidderId().equals(bid.getBidderId())) {
                b.supersede();
            }
        }
        bid.accept();
    }

    public synchronized boolean placeBid(Bid bid) {
        return state.placeBid(this, bid);
    }

    public synchronized void start() {
        state.start(this);
    }

    public synchronized void end() {
        state.end(this);
    }

    public synchronized void cancel() {
        state.cancel(this);
    }

    public synchronized BigDecimal nextMinimumBid() {
        return currentPrice.add(bidIncrement);
    }

    public synchronized boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return state.status() == AuctionStatus.ACTIVE && now.isBefore(endTime);
    }

    public String getId() {
        return id;
    }

    public String getItemId() {
        return itemId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public BigDecimal getBidIncrement() {
        return bidIncrement;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public AuctionStatus getStatus() {
        return state.status();
    }

    public String getWinningBidderId() {
        return winningBidderId;
    }

    public List<Bid> getBids() {
        return Collections.unmodifiableList(new ArrayList<Bid>(bids));
    }

    @Override
    public String toString() {
        return "Auction{id='" + id + "', currentPrice=" + currentPrice
                + ", bids=" + bids.size() + ", status=" + getStatus() + "}";
    }
}
