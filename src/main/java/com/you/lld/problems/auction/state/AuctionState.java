package com.you.lld.problems.auction.state;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.AuctionStatus;
import com.you.lld.problems.auction.model.Bid;

/**
 * State pattern for auction lifecycle transitions.
 */
public interface AuctionState {

    AuctionStatus status();

    void start(Auction auction);

    void end(Auction auction);

    void cancel(Auction auction);

    boolean placeBid(Auction auction, Bid bid);
}
