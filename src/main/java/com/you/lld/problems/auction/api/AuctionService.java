package com.you.lld.problems.auction.api;

import com.you.lld.problems.auction.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface AuctionService {
    String createAuction(String itemId, String sellerId, BigDecimal startingPrice, 
                        LocalDateTime startTime, LocalDateTime endTime);
    Auction getAuction(String auctionId);
    List<Auction> getActiveAuctions();
    boolean placeBid(String auctionId, String bidderId, BigDecimal amount);
    void startAuction(String auctionId);
    void endAuction(String auctionId);
    List<Bid> getAuctionBids(String auctionId);
}
