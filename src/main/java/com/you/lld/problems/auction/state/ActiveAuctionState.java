package com.you.lld.problems.auction.state;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.AuctionStatus;
import com.you.lld.problems.auction.model.Bid;

import java.time.LocalDateTime;

public final class ActiveAuctionState implements AuctionState {

    @Override
    public AuctionStatus status() {
        return AuctionStatus.ACTIVE;
    }

    @Override
    public void start(Auction auction) {
        // already active
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
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            return false;
        }
        if (bid.getAmount().compareTo(auction.getCurrentPrice()) <= 0) {
            return false;
        }
        auction.recordAcceptedBid(bid);
        return true;
    }
}
