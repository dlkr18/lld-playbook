package com.you.lld.problems.auction;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.Bid;
import com.you.lld.problems.auction.model.ProxyBid;
import com.you.lld.problems.auction.service.AuctionService;
import com.you.lld.problems.auction.service.impl.AuctionServiceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo: lifecycle, bidding, proxy bids, concurrency.
 */
public class AuctionDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Auction System Demo ===\n");

        AuctionServiceImpl service = new AuctionServiceImpl();
        try {
            String auctionId = demoLifecycleAndBidding(service);
            demoProxyBidding(service);
            demoConcurrentBids(service, auctionId);
            demoMultipleAuctions(service);
            demoGuardrails(service);
        } finally {
            service.shutdown();
        }

        System.out.println("\n=== Demo complete ===");
    }

    private static String demoLifecycleAndBidding(AuctionService service) {
        System.out.println("--- Demo 1: Lifecycle & manual bidding ---");
        String auctionId = service.createAuction(
                "vintage-watch-001", "seller-1",
                new BigDecimal("100.00"),
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(2));
        service.startAuction(auctionId);

        System.out.println("Bid $150: " + service.placeBid(auctionId, "bidder-1", new BigDecimal("150.00")));
        System.out.println("Bid $175: " + service.placeBid(auctionId, "bidder-2", new BigDecimal("175.00")));
        System.out.println("Bid $180 (too low): " + service.placeBid(auctionId, "bidder-3", new BigDecimal("180.00")));

        Auction auction = service.getAuction(auctionId);
        System.out.println("Current price: $" + auction.getCurrentPrice()
                + ", leader: " + auction.getWinningBidderId());
        System.out.println();
        return auctionId;
    }

    private static void demoProxyBidding(AuctionService service) {
        System.out.println("--- Demo 2: Proxy (auto) bidding ---");
        String auctionId = service.createAuction(
                "painting-002", "seller-2",
                new BigDecimal("500.00"),
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(1));
        service.startAuction(auctionId);

        service.registerProxyBid(auctionId, new ProxyBid("proxy-bidder-a", new BigDecimal("600.00")));
        System.out.println("Proxy A max=$600 registered → opens at min bid");

        service.placeBid(auctionId, "manual-bidder", new BigDecimal("550.00"));
        Auction auction = service.getAuction(auctionId);
        System.out.println("After manual $550, price=$" + auction.getCurrentPrice()
                + ", leader=" + auction.getWinningBidderId() + " (proxy counter-bid)");

        service.registerProxyBid(auctionId, new ProxyBid("proxy-bidder-b", new BigDecimal("700.00")));
        service.placeBid(auctionId, "manual-bidder", new BigDecimal("650.00"));
        auction = service.getAuction(auctionId);
        System.out.println("Proxy war: price=$" + auction.getCurrentPrice()
                + ", leader=" + auction.getWinningBidderId());
        System.out.println();
    }

    private static void demoConcurrentBids(AuctionService service, String auctionId) throws InterruptedException {
        System.out.println("--- Demo 3: Concurrent bids (synchronized) ---");
        int threads = 20;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger accepted = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final int n = i;
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        BigDecimal amount = new BigDecimal(200 + n);
                        if (service.placeBid(auctionId, "concurrent-" + n, amount)) {
                            accepted.incrementAndGet();
                        }
                    } catch (Exception ignored) {
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        start.countDown();
        done.await();
        pool.shutdown();

        Auction auction = service.getAuction(auctionId);
        System.out.println("Accepted concurrent bids: " + accepted.get()
                + ", final price=$" + auction.getCurrentPrice()
                + ", total bids=" + service.getAuctionBids(auctionId).size());
        System.out.println();
    }

    private static void demoMultipleAuctions(AuctionService service) {
        System.out.println("--- Demo 4: End auction & history ---");
        List<Auction> active = service.getActiveAuctions();
        if (!active.isEmpty()) {
            String id = active.get(0).getId();
            service.endAuction(id);
            Auction ended = service.getAuction(id);
            System.out.println("Ended auction " + id + " → status=" + ended.getStatus()
                    + ", winner=" + ended.getWinningBidderId());

            List<Bid> bids = service.getAuctionBids(id);
            System.out.println("Bid history (" + bids.size() + " bids):");
            int shown = Math.min(3, bids.size());
            for (int i = bids.size() - shown; i < bids.size(); i++) {
                Bid b = bids.get(i);
                System.out.println("  " + b.getBidderId() + ": $" + b.getAmount());
            }
        }
        System.out.println("Active auctions remaining: " + service.getActiveAuctions().size());
        System.out.println();
    }

    private static void demoGuardrails(AuctionService service) {
        System.out.println("--- Demo 5: Guardrails ---");
        String auctionId = service.createAuction(
                "coin-003", "seller-3",
                new BigDecimal("50.00"),
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(1));
        service.startAuction(auctionId);

        try {
            service.placeBid(auctionId, "seller-3", new BigDecimal("100.00"));
            System.out.println("FAIL: seller self-bid allowed");
        } catch (IllegalStateException e) {
            System.out.println("Self-bid blocked: " + e.getMessage());
        }

        service.cancelAuction(auctionId);
        boolean afterCancel = service.placeBid(auctionId, "bidder-x", new BigDecimal("60.00"));
        System.out.println("Bid after cancel: " + afterCancel + " (expected false)");
        System.out.println();
    }
}
