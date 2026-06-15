package com.you.lld.problems.auction.state;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.AuctionStatus;
import com.you.lld.problems.auction.model.Bid;

public final class CancelledAuctionState implements AuctionState {

    @Override
    public AuctionStatus status() {
        return AuctionStatus.CANCELLED;
    }

    @Override
    public void start(Auction auction) {
        throw new IllegalStateException("Cannot start a cancelled auction");
    }

    @Override
    public void end(Auction auction) {
        throw new IllegalStateException("Cannot end a cancelled auction");
    }

    @Override
    public void cancel(Auction auction) {
        // idempotent
    }

    @Override
    public boolean placeBid(Auction auction, Bid bid) {
        return false;
    }
}
