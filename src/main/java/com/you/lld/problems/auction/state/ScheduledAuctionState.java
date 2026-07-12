package com.you.lld.problems.auction.state;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.AuctionStatus;
import com.you.lld.problems.auction.model.Bid;

public final class ScheduledAuctionState implements AuctionState {

    @Override
    public AuctionStatus status() {
        return AuctionStatus.SCHEDULED;
    }

    @Override
    public void start(Auction auction) {
        auction.transitionTo(new ActiveAuctionState());
    }

    @Override
    public void end(Auction auction) {
        auction.transitionTo(new CompletedAuctionState());
    }

    @Override
    public void cancel(Auction auction) {
        auction.transitionTo(new CancelledAuctionState());
    }

    @Override
    public boolean placeBid(Auction auction, Bid bid) {
        return false;
    }
}
