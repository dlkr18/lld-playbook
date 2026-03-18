package com.you.lld.problems.auction.impl;

import com.you.lld.problems.auction.api.AuctionService;
import com.you.lld.problems.auction.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Thread-safe auction service with automatic expiry via background thread.
 */
public class AuctionServiceImpl implements AuctionService {
    private final Map<String, Auction> auctions = new ConcurrentHashMap<>();
    private final ScheduledExecutorService expiryScheduler;

    public AuctionServiceImpl() {
        this.expiryScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "auction-expiry");
            t.setDaemon(true);
            return t;
        });
        // Check for expired auctions every second
        expiryScheduler.scheduleAtFixedRate(this::expireAuctions, 1, 1, TimeUnit.SECONDS);
    }

    /** Automatically end auctions that have passed their end time. */
    private void expireAuctions() {
        LocalDateTime now = LocalDateTime.now();
        for (Auction auction : auctions.values()) {
            if (auction.getStatus() == AuctionStatus.ACTIVE && now.isAfter(auction.getEndTime())) {
                auction.end();
                System.out.println("[Auto-expired] Auction " + auction.getId());
            }
        }
    }

    public void shutdown() {
        expiryScheduler.shutdown();
    }
    
    @Override
    public String createAuction(String itemId, String sellerId, BigDecimal startingPrice,
                               LocalDateTime startTime, LocalDateTime endTime) {
        String auctionId = UUID.randomUUID().toString();
        Auction auction = new Auction(auctionId, itemId, sellerId, startingPrice, startTime, endTime);
        auctions.put(auctionId, auction);
        System.out.println("Auction created: " + auctionId);
        return auctionId;
    }
    
    @Override
    public Auction getAuction(String auctionId) {
        return auctions.get(auctionId);
    }
    
    @Override
    public List<Auction> getActiveAuctions() {
        return auctions.values().stream()
            .filter(Auction::isActive)
            .collect(Collectors.toList());
    }
    
    @Override
    public boolean placeBid(String auctionId, String bidderId, BigDecimal amount) {
        Auction auction = auctions.get(auctionId);
        if (auction == null) {
            return false;
        }

        // Prevent self-bidding (seller can't bid on own auction)
        if (bidderId.equals(auction.getSellerId())) {
            throw new IllegalStateException("Seller cannot bid on own auction");
        }
        
        String bidId = UUID.randomUUID().toString();
        Bid bid = new Bid(bidId, auctionId, bidderId, amount);
        
        // placeBid on Auction is synchronized
        if (auction.placeBid(bid)) {
            bid.accept();
            System.out.println("Bid placed: " + amount + " by " + bidderId);
            return true;
        }
        
        bid.reject();
        return false;
    }
    
    @Override
    public void startAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.start();
            System.out.println("Auction started: " + auctionId);
        }
    }
    
    @Override
    public void endAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.end();
            System.out.println("Auction ended: " + auctionId);
            if (auction.getWinningBidderId() != null) {
                System.out.println("Winner: " + auction.getWinningBidderId() + 
                                 " with bid: $" + auction.getCurrentPrice());
            }
        }
    }
    
    @Override
    public List<Bid> getAuctionBids(String auctionId) {
        Auction auction = auctions.get(auctionId);
        return auction != null ? auction.getBids() : Collections.emptyList();
    }
}
