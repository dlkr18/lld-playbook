package com.you.lld.problems.auction.state;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.AuctionStatus;
import com.you.lld.problems.auction.model.Bid;

public final class CompletedAuctionState implements AuctionState {

    @Override
    public AuctionStatus status() {
        return AuctionStatus.COMPLETED;
    }

    @Override
    public void start(Auction auction) {
        throw new IllegalStateException("Cannot start a completed auction");
    }

    @Override
    public void end(Auction auction) {
        // idempotent
    }

    @Override
    public void cancel(Auction auction) {
        throw new IllegalStateException("Cannot cancel a completed auction");
    }

    @Override
    public boolean placeBid(Auction auction, Bid bid) {
        return false;
    }
}
