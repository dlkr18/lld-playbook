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
            return false;
        }
        resolveProxyCounterBids(auctionId, bidderId);
        return true;
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
        if (proxyBid.getMaxAmount().compareTo(minBid) >= 0) {
            return placeBid(auctionId, proxyBid.getBidderId(), minBid);
        }
        return true;
    }

    private void resolveProxyCounterBids(String auctionId, String triggeringBidderId) {
        Auction auction = auctions.get(auctionId);
        Map<String, ProxyBid> proxies = proxyBids.get(auctionId);
        if (auction == null || proxies == null) {
            return;
        }

        ProxyBid bestProxy = null;
        for (Map.Entry<String, ProxyBid> entry : proxies.entrySet()) {
            if (entry.getKey().equals(triggeringBidderId)) {
                continue;
            }
            ProxyBid proxy = entry.getValue();
            if (proxy.getMaxAmount().compareTo(auction.getCurrentPrice()) > 0) {
                if (bestProxy == null
                        || proxy.getMaxAmount().compareTo(bestProxy.getMaxAmount()) > 0) {
                    bestProxy = proxy;
                }
            }
        }

        if (bestProxy != null) {
            BigDecimal next = auction.nextMinimumBid();
            if (next.compareTo(bestProxy.getMaxAmount()) <= 0) {
                placeBid(auctionId, bestProxy.getBidderId(), next);
            } else {
                placeBid(auctionId, bestProxy.getBidderId(), bestProxy.getMaxAmount());
            }
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
