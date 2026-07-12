package com.you.lld.problems.auction;

import com.you.lld.problems.auction.service.AuctionService;
import com.you.lld.problems.auction.service.impl.AuctionServiceImpl;

/**
 * Facade for the auction system.
 */
public final class AuctionSystem {

    private final AuctionService service;

    public AuctionSystem() {
        this(new AuctionServiceImpl());
    }

    public AuctionSystem(AuctionService service) {
        this.service = service;
    }

    public AuctionService service() {
        return service;
    }
}
