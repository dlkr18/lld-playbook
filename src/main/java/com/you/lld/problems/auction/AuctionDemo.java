package com.you.lld.problems.auction;

import com.you.lld.problems.auction.impl.AuctionServiceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo: Auction system with bidding, time-based lifecycle, concurrent bids.
 */
public class AuctionDemo {

    public static void main(String[] args) {
        System.out.println("=== Auction System Demo ===\n");

        AuctionServiceImpl service = new AuctionServiceImpl();

        // Create auction
        System.out.println("--- Create auction ---");
        String auctionId = service.createAuction(
            "vintage-watch-001", "seller-1", 
            new BigDecimal("100.00"),
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(2)
        );
        System.out.println("Auction created: " + auctionId);
        com.you.lld.problems.auction.model.Auction a = service.getAuction(auctionId);
        System.out.println("Status: " + a.getStatus());

        // Start auction
        service.startAuction(auctionId);
        System.out.println("Started: " + service.getAuction(auctionId).getStatus());

        // Place bids
        System.out.println("\n--- Bidding ---");
        boolean b1 = service.placeBid(auctionId, "bidder-1", new BigDecimal("150.00"));
        System.out.println("Bid $150 by bidder-1: " + b1);

        boolean b2 = service.placeBid(auctionId, "bidder-2", new BigDecimal("175.00"));
        System.out.println("Bid $175 by bidder-2: " + b2);

        boolean b3 = service.placeBid(auctionId, "bidder-1", new BigDecimal("200.00"));
        System.out.println("Bid $200 by bidder-1: " + b3);

        // Low bid should fail
        boolean b4 = service.placeBid(auctionId, "bidder-3", new BigDecimal("180.00"));
        System.out.println("Bid $180 (below current): " + b4);

        // Check state
        com.you.lld.problems.auction.model.Auction auction = service.getAuction(auctionId);
        System.out.println("\nCurrent price: $" + auction.getCurrentPrice());
        System.out.println("Leading bidder: " + auction.getWinningBidderId());

        // Bid history
        System.out.println("\n--- Bid history ---");
        List<com.you.lld.problems.auction.model.Bid> bids = service.getAuctionBids(auctionId);
        System.out.println("Total bids: " + bids.size());
        for (com.you.lld.problems.auction.model.Bid bid : bids) {
            System.out.println("  " + bid.getBidderId() + ": $" + bid.getAmount());
        }

        // End auction
        System.out.println("\n--- End auction ---");
        service.endAuction(auctionId);
        auction = service.getAuction(auctionId);
        System.out.println("Status: " + auction.getStatus());
        System.out.println("Winner: " + auction.getWinningBidderId());
        System.out.println("Final price: $" + auction.getCurrentPrice());

        // Multiple auctions
        System.out.println("\n--- Multiple auctions ---");
        String a2 = service.createAuction("painting-002", "seller-2", 
            new BigDecimal("500.00"), LocalDateTime.now(), LocalDateTime.now().plusHours(1));
        service.startAuction(a2);
        List<com.you.lld.problems.auction.model.Auction> active = service.getActiveAuctions();
        System.out.println("Active auctions: " + active.size());

        System.out.println("\n=== Demo complete ===");
    }
}
