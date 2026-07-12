package com.you.lld.problems.auction.model;

import java.math.BigDecimal;

/**
 * Proxy (auto) bid: bidder sets a max; system bids minimum increments up to max.
 */
public final class ProxyBid {
    private final String bidderId;
    private final BigDecimal maxAmount;

    public ProxyBid(String bidderId, BigDecimal maxAmount) {
        if (bidderId == null || bidderId.trim().isEmpty()) {
            throw new IllegalArgumentException("Bidder required");
        }
        if (maxAmount == null || maxAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Max amount must be positive");
        }
        this.bidderId = bidderId;
        this.maxAmount = maxAmount;
    }

    public String getBidderId() {
        return bidderId;
    }

    public BigDecimal getMaxAmount() {
        return maxAmount;
    }
}
