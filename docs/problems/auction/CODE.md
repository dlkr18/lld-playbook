# auction - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/auction/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py auction`.

## Project Structure (15 files)

```
auction/
├── AuctionDemo.java
├── AuctionSystem.java
├── model/Auction.java
├── model/AuctionStatus.java
├── model/Bid.java
├── model/BidStatus.java
├── model/Item.java
├── model/ProxyBid.java
├── service/AuctionService.java
├── service/impl/AuctionServiceImpl.java
├── state/ActiveAuctionState.java
├── state/AuctionState.java
├── state/CancelledAuctionState.java
├── state/CompletedAuctionState.java
├── state/ScheduledAuctionState.java
```

## Source Code

### `AuctionDemo.java`

<details>
<summary>Click to view AuctionDemo.java</summary>

```java
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
```

</details>

### `AuctionSystem.java`

<details>
<summary>Click to view AuctionSystem.java</summary>

```java
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
```

</details>

### `model/Auction.java`

<details>
<summary>Click to view model/Auction.java</summary>

```java
package com.you.lld.problems.auction.model;

import com.you.lld.problems.auction.state.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Auction aggregate with State-pattern lifecycle and synchronized bid placement.
 */
public class Auction {
    private final String id;
    private final String itemId;
    private final String sellerId;
    private final BigDecimal startingPrice;
    private final BigDecimal bidIncrement;
    private BigDecimal currentPrice;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private AuctionState state;
    private String winningBidderId;
    private final List<Bid> bids;

    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   LocalDateTime startTime, LocalDateTime endTime) {
        this(id, itemId, sellerId, startingPrice, new BigDecimal("1.00"), startTime, endTime);
    }

    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   BigDecimal bidIncrement, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.bidIncrement = bidIncrement;
        this.currentPrice = startingPrice;
        this.startTime = startTime;
        this.endTime = endTime;
        this.state = new ScheduledAuctionState();
        this.bids = new ArrayList<Bid>();
    }

    public synchronized void transitionTo(AuctionState newState) {
        this.state = newState;
    }

    public synchronized void recordAcceptedBid(Bid bid) {
        bids.add(bid);
        currentPrice = bid.getAmount();
        winningBidderId = bid.getBidderId();
        for (Bid b : bids) {
            if (!b.getId().equals(bid.getId()) && b.getBidderId().equals(bid.getBidderId())) {
                b.supersede();
            }
        }
        bid.accept();
    }

    public synchronized boolean placeBid(Bid bid) {
        return state.placeBid(this, bid);
    }

    public synchronized void start() {
        state.start(this);
    }

    public synchronized void end() {
        state.end(this);
    }

    public synchronized void cancel() {
        state.cancel(this);
    }

    public synchronized BigDecimal nextMinimumBid() {
        return currentPrice.add(bidIncrement);
    }

    public synchronized boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return state.status() == AuctionStatus.ACTIVE && now.isBefore(endTime);
    }

    public String getId() {
        return id;
    }

    public String getItemId() {
        return itemId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public BigDecimal getBidIncrement() {
        return bidIncrement;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public AuctionStatus getStatus() {
        return state.status();
    }

    public String getWinningBidderId() {
        return winningBidderId;
    }

    public List<Bid> getBids() {
        return Collections.unmodifiableList(new ArrayList<Bid>(bids));
    }

    @Override
    public String toString() {
        return "Auction{id='" + id + "', currentPrice=" + currentPrice
                + ", bids=" + bids.size() + ", status=" + getStatus() + "}";
    }
}
```

</details>

### `model/AuctionStatus.java`

<details>
<summary>Click to view model/AuctionStatus.java</summary>

```java
package com.you.lld.problems.auction.model;

public enum AuctionStatus {
    SCHEDULED, ACTIVE, COMPLETED, CANCELLED
}
```

</details>

### `model/Bid.java`

<details>
<summary>Click to view model/Bid.java</summary>

```java
package com.you.lld.problems.auction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Bid {
    private final String id;
    private final String auctionId;
    private final String bidderId;
    private final BigDecimal amount;
    private final LocalDateTime timestamp;
    private BidStatus status;
    
    public Bid(String id, String auctionId, String bidderId, BigDecimal amount) {
        this.id = id;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.status = BidStatus.PENDING;
    }
    
    public void accept() { this.status = BidStatus.ACCEPTED; }
    public void reject() { this.status = BidStatus.REJECTED; }
    public void win() { this.status = BidStatus.WINNING; }
    public void supersede() { this.status = BidStatus.REJECTED; }
    
    public String getId() { return id; }
    public String getAuctionId() { return auctionId; }
    public String getBidderId() { return bidderId; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public BidStatus getStatus() { return status; }
    
    @Override
    public String toString() {
        return "Bid{id='" + id + "', bidderId='" + bidderId + "', amount=" + amount + 
               ", status=" + status + "}";
    }
}
```

</details>

### `model/BidStatus.java`

<details>
<summary>Click to view model/BidStatus.java</summary>

```java
package com.you.lld.problems.auction.model;

public enum BidStatus {
    PENDING, ACCEPTED, REJECTED, WINNING, OUTBID
}
```

</details>

### `model/Item.java`

<details>
<summary>Click to view model/Item.java</summary>

```java
package com.you.lld.problems.auction.model;

public class Item {
    private final String id;
    private String name;
    private String description;
    private String category;
    private String sellerId;
    
    public Item(String id, String name, String description, String category, String sellerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.sellerId = sellerId;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getSellerId() { return sellerId; }
    
    @Override
    public String toString() {
        return "Item{id='" + id + "', name='" + name + "', category='" + category + "'}";
    }
}
```

</details>

### `model/ProxyBid.java`

<details>
<summary>Click to view model/ProxyBid.java</summary>

```java
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
```

</details>

### `service/AuctionService.java`

<details>
<summary>Click to view service/AuctionService.java</summary>

```java
package com.you.lld.problems.auction.service;

import com.you.lld.problems.auction.model.Auction;
import com.you.lld.problems.auction.model.Bid;
import com.you.lld.problems.auction.model.ProxyBid;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface AuctionService {

    String createAuction(String itemId, String sellerId, BigDecimal startingPrice,
                         LocalDateTime startTime, LocalDateTime endTime);

    Auction getAuction(String auctionId);

    List<Auction> getActiveAuctions();

    boolean placeBid(String auctionId, String bidderId, BigDecimal amount);

    boolean registerProxyBid(String auctionId, ProxyBid proxyBid);

    void startAuction(String auctionId);

    void endAuction(String auctionId);

    void cancelAuction(String auctionId);

    List<Bid> getAuctionBids(String auctionId);

    void shutdown();
}
```

</details>

### `service/impl/AuctionServiceImpl.java`

<details>
<summary>Click to view service/impl/AuctionServiceImpl.java</summary>

```java
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
```

</details>

### `state/ActiveAuctionState.java`

<details>
<summary>Click to view state/ActiveAuctionState.java</summary>

```java
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
```

</details>

### `state/AuctionState.java`

<details>
<summary>Click to view state/AuctionState.java</summary>

```java
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
```

</details>

### `state/CancelledAuctionState.java`

<details>
<summary>Click to view state/CancelledAuctionState.java</summary>

```java
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
```

</details>

### `state/CompletedAuctionState.java`

<details>
<summary>Click to view state/CompletedAuctionState.java</summary>

```java
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
```

</details>

### `state/ScheduledAuctionState.java`

<details>
<summary>Click to view state/ScheduledAuctionState.java</summary>

```java
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
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.auction.AuctionDemo"
```
