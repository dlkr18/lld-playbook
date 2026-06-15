package com.you.lld.problems.auction.service;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.Bid;
import com.you.lld.problems.auction.model.ProxyBid;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface AuctionService {

    String createAuction(String itemId, String sellerId, BigDecimal startingPrice,
                         LocalDateTime startTime, LocalDateTime endTime);

    Auction getAuction(String auctionId);

    List<Auction> getActiveAuctions();

    boolean placeBid(String auctionId, String bidderId, BigDecimal amount);

    boolean registerProxyBid(String auctionId, ProxyBid proxyBid);

    void startAuction(String auctionId);

    void endAuction(String auctionId);

    void cancelAuction(String auctionId);

    List<Bid> getAuctionBids(String auctionId);

    void shutdown();
}
