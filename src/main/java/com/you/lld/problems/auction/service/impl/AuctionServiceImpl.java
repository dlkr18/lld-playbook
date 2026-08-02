package com.you.lld.problems.auction.service.impl;

import com.you.lld.problems.auction.model.*;
import com.you.lld.problems.auction.service.AuctionService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Thread-safe auction service: State lifecycle, synchronized bids, proxy auto-bidding.
 */
public final class AuctionServiceImpl implements AuctionService {

    private final Map<String, Auction> auctions = new ConcurrentHashMap<String, Auction>();
    private final Map<String, Map<String, ProxyBid>> proxyBids = new ConcurrentHashMap<String, Map<String, ProxyBid>>();
    private final ScheduledExecutorService expiryScheduler;

    public AuctionServiceImpl() {
        this.expiryScheduler = Executors.newSingleThreadScheduledExecutor(new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "auction-expiry");
                t.setDaemon(true);
                return t;
            }
        });
        expiryScheduler.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                expireAuctions();
            }
        }, 1, 1, TimeUnit.SECONDS);
    }

    private void expireAuctions() {
        LocalDateTime now = LocalDateTime.now();
        for (Auction auction : auctions.values()) {
            if (auction.getStatus() == AuctionStatus.ACTIVE && now.isAfter(auction.getEndTime())) {
                auction.end();
            }
        }
    }

    @Override
    public void shutdown() {
        expiryScheduler.shutdown();
    }

    @Override
    public String createAuction(String itemId, String sellerId, BigDecimal startingPrice,
                                LocalDateTime startTime, LocalDateTime endTime) {
        String auctionId = UUID.randomUUID().toString();
        Auction auction = new Auction(auctionId, itemId, sellerId, startingPrice, startTime, endTime);
        auctions.put(auctionId, auction);
        proxyBids.put(auctionId, new ConcurrentHashMap<String, ProxyBid>());
        return auctionId;
    }

    @Override
    public Auction getAuction(String auctionId) {
        return auctions.get(auctionId);
    }

    @Override
    public List<Auction> getActiveAuctions() {
        List<Auction> active = new ArrayList<Auction>();
        for (Auction a : auctions.values()) {
            if (a.isActive()) {
                active.add(a);
            }
        }
        return active;
    }

    @Override
    public boolean placeBid(String auctionId, String bidderId, BigDecimal amount) {
        boolean accepted = placeRawBid(auctionId, bidderId, amount);
        if (accepted) {
            resolveProxyCounterBids(auctionId);
        }
        return accepted;
    }

    /**
     * Records a bid without triggering proxy resolution.
     *
     * <p>Separating this from {@link #placeBid} is what breaks the recursion:
     * proxy resolution places a raw bid and settles in one step instead of
     * calling back into {@code placeBid} and bouncing again.
     */
    private boolean placeRawBid(String auctionId, String bidderId, BigDecimal amount) {
        Auction auction = auctions.get(auctionId);
        if (auction == null) {
            return false;
        }
        if (bidderId.equals(auction.getSellerId())) {
            throw new IllegalStateException("Seller cannot bid on own auction");
        }

        String bidId = UUID.randomUUID().toString();
        Bid bid = new Bid(bidId, auctionId, bidderId, amount);
        boolean accepted = auction.placeBid(bid);
        if (!accepted) {
            bid.reject();
        }
        return accepted;
    }

    @Override
    public boolean registerProxyBid(String auctionId, ProxyBid proxyBid) {
        Auction auction = auctions.get(auctionId);
        if (auction == null) {
            return false;
        }
        if (proxyBid.getBidderId().equals(auction.getSellerId())) {
            throw new IllegalStateException("Seller cannot proxy-bid on own auction");
        }
        Map<String, ProxyBid> proxies = proxyBids.get(auctionId);
        if (proxies == null) {
            return false;
        }
        proxies.put(proxyBid.getBidderId(), proxyBid);

        BigDecimal minBid = auction.nextMinimumBid();
        if (proxyBid.getMaxAmount().compareTo(minBid) >= 0 && auction.getWinningBidderId() == null) {
            // First proxy on a bare auction opens at the minimum.
            placeRawBid(auctionId, proxyBid.getBidderId(), minBid);
        }
        resolveProxyCounterBids(auctionId);
        return true;
    }

    /**
     * Settles proxy bidding in ONE step.
     *
     * <p>The previous version placed a single increment and called back into
     * {@code placeBid}, which resolved proxies again — mutual recursion, one stack
     * frame per bid increment. Two proxies with maxima 500000 and 499999 at a 1.00
     * increment therefore blew the stack (reproduced: {@code StackOverflowError}).
     *
     * <p>The real rule needs no iteration at all: the winner is the highest
     * ceiling, and the price is the <em>second</em>-highest ceiling plus one
     * increment, capped at the winner's ceiling. That is a direct computation from
     * the top two maxima.
     */
    private void resolveProxyCounterBids(String auctionId) {
        Auction auction = auctions.get(auctionId);
        Map<String, ProxyBid> proxies = proxyBids.get(auctionId);
        if (auction == null || proxies == null || proxies.isEmpty()) {
            return;
        }

        ProxyBid best = null;
        ProxyBid runnerUp = null;
        for (ProxyBid proxy : proxies.values()) {
            if (proxy.getBidderId().equals(auction.getSellerId())) {
                continue;
            }
            if (best == null || proxy.getMaxAmount().compareTo(best.getMaxAmount()) > 0) {
                runnerUp = best;
                best = proxy;
            } else if (runnerUp == null || proxy.getMaxAmount().compareTo(runnerUp.getMaxAmount()) > 0) {
                runnerUp = proxy;
            }
        }
        if (best == null) {
            return;
        }

        BigDecimal current = auction.getCurrentPrice();
        if (best.getMaxAmount().compareTo(current) <= 0) {
            return;   // no proxy can beat the standing bid
        }

        // What must the winner outbid? The standing price only counts if someone
        // ELSE holds it — a proxy never bids against its own standing bid. The
        // runner-up's ceiling always counts, even when the leader is already
        // winning: their willingness to pay is what drives the price up.
        BigDecimal toBeat = null;
        if (!best.getBidderId().equals(auction.getWinningBidderId())) {
            toBeat = current;
        }
        if (runnerUp != null) {
            toBeat = (toBeat == null) ? runnerUp.getMaxAmount() : toBeat.max(runnerUp.getMaxAmount());
        }
        if (toBeat == null) {
            return;   // leader is unopposed; the price stays where it is
        }

        BigDecimal target = toBeat.add(auction.getBidIncrement()).min(best.getMaxAmount());
        if (target.compareTo(current) > 0) {
            placeRawBid(auctionId, best.getBidderId(), target);
        }
    }

    @Override
    public void startAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.start();
        }
    }

    @Override
    public void endAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.end();
        }
    }

    @Override
    public void cancelAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.cancel();
        }
    }

    @Override
    public List<Bid> getAuctionBids(String auctionId) {
        Auction auction = auctions.get(auctionId);
        return auction != null ? auction.getBids() : Collections.<Bid>emptyList();
    }
}
