package com.you.lld.problems.auction;
import java.util.*;

public class AuctionSystem {
    private final Map<String, Auction> auctions;
    
    public AuctionSystem() {
        this.auctions = new HashMap<>();
    }
    
    public void createAuction(Auction auction) {
        auctions.put(auction.toString(), auction);
    }
    
    public boolean placeBid(String auctionId, Bid bid) {
        Auction auction = auctions.get(auctionId);
        return auction != null && auction.placeBid(bid);
    }
}
