# auction - Complete Implementation

## 📁 Project Structure (11 files)

```
auction/
├── Auction.java
├── AuctionSystem.java
├── Bid.java
├── Demo.java
├── api/AuctionService.java
├── impl/AuctionServiceImpl.java
├── model/Auction.java
├── model/AuctionStatus.java
├── model/Bid.java
├── model/BidStatus.java
├── model/Item.java
```

## 📝 Source Code

### 📄 `Auction.java`

```java
package com.you.lld.problems.auction;
import java.time.LocalDateTime;
import java.util.*;

public class Auction {
    public enum AuctionStatus { ACTIVE, CLOSED }
    
    private final String auctionId;
    private final String itemId;
    private double startingPrice;
    private AuctionStatus status;
    private List<Bid> bids;
    private LocalDateTime endTime;
    
    public Auction(String auctionId, String itemId, double startingPrice, LocalDateTime endTime) {
        this.auctionId = auctionId;
        this.itemId = itemId;
        this.startingPrice = startingPrice;
        this.status = AuctionStatus.ACTIVE;
        this.bids = new ArrayList<>();
        this.endTime = endTime;
    }
    
    public boolean placeBid(Bid bid) {
        if (status != AuctionStatus.ACTIVE || LocalDateTime.now().isAfter(endTime)) {
            return false;
        }
        if (bid.getAmount() <= getCurrentPrice()) {
            return false;
        }
        bids.add(bid);
        return true;
    }
    
    public double getCurrentPrice() {
        return bids.isEmpty() ? startingPrice : bids.get(bids.size() - 1).getAmount();
    }
    
    public Bid getWinningBid() {
        return bids.isEmpty() ? null : bids.get(bids.size() - 1);
    }
    
    public void close() {
        this.status = AuctionStatus.CLOSED;
    }
}
```

### 📄 `AuctionSystem.java`

```java
package com.you.lld.problems.auction;
import java.util.*;

public class AuctionSystem {
    private final Map<String, Auction> auctions;
    
    public AuctionSystem() {
        this.auctions = new HashMap<>();
    }
    
    public void createAuction(Auction auction) {
        auctions.put(auction.toString(), auction);
    }
    
    public boolean placeBid(String auctionId, Bid bid) {
        Auction auction = auctions.get(auctionId);
        return auction != null && auction.placeBid(bid);
    }
}
```

### 📄 `Bid.java`

```java
package com.you.lld.problems.auction;
import java.time.LocalDateTime;

public class Bid {
    private final String bidId;
    private final String auctionId;
    private final String userId;
    private final double amount;
    private final LocalDateTime timestamp;
    
    public Bid(String bidId, String auctionId, String userId, double amount) {
        this.bidId = bidId;
        this.auctionId = auctionId;
        this.userId = userId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getBidId() { return bidId; }
    public String getUserId() { return userId; }
    public double getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
```

### 📄 `Demo.java`

```java
package com.you.lld.problems.auction;
public class Demo { public static void main(String[] args) { System.out.println("Auction"); } }```

### 📄 `api/AuctionService.java`

```java
package com.you.lld.problems.auction.api;

import com.you.lld.problems.auction.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface AuctionService {
    String createAuction(String itemId, String sellerId, BigDecimal startingPrice, 
                        LocalDateTime startTime, LocalDateTime endTime);
    Auction getAuction(String auctionId);
    List<Auction> getActiveAuctions();
    boolean placeBid(String auctionId, String bidderId, BigDecimal amount);
    void startAuction(String auctionId);
    void endAuction(String auctionId);
    List<Bid> getAuctionBids(String auctionId);
}
```

### 📄 `impl/AuctionServiceImpl.java`

```java
package com.you.lld.problems.auction.impl;

import com.you.lld.problems.auction.api.AuctionService;
import com.you.lld.problems.auction.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class AuctionServiceImpl implements AuctionService {
    private final Map<String, Auction> auctions = new ConcurrentHashMap<>();
    
    @Override
    public String createAuction(String itemId, String sellerId, BigDecimal startingPrice,
                               LocalDateTime startTime, LocalDateTime endTime) {
        String auctionId = UUID.randomUUID().toString();
        Auction auction = new Auction(auctionId, itemId, sellerId, startingPrice, startTime, endTime);
        auctions.put(auctionId, auction);
        System.out.println("Auction created: " + auctionId);
        return auctionId;
    }
    
    @Override
    public Auction getAuction(String auctionId) {
        return auctions.get(auctionId);
    }
    
    @Override
    public List<Auction> getActiveAuctions() {
        return auctions.values().stream()
            .filter(Auction::isActive)
            .collect(Collectors.toList());
    }
    
    @Override
    public boolean placeBid(String auctionId, String bidderId, BigDecimal amount) {
        Auction auction = auctions.get(auctionId);
        if (auction == null) {
            return false;
        }
        
        String bidId = UUID.randomUUID().toString();
        Bid bid = new Bid(bidId, auctionId, bidderId, amount);
        
        if (auction.placeBid(bid)) {
            bid.accept();
            System.out.println("Bid placed: " + amount + " by " + bidderId);
            return true;
        }
        
        bid.reject();
        return false;
    }
    
    @Override
    public void startAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.start();
            System.out.println("Auction started: " + auctionId);
        }
    }
    
    @Override
    public void endAuction(String auctionId) {
        Auction auction = auctions.get(auctionId);
        if (auction != null) {
            auction.end();
            System.out.println("Auction ended: " + auctionId);
            if (auction.getWinningBidderId() != null) {
                System.out.println("Winner: " + auction.getWinningBidderId() + 
                                 " with bid: $" + auction.getCurrentPrice());
            }
        }
    }
    
    @Override
    public List<Bid> getAuctionBids(String auctionId) {
        Auction auction = auctions.get(auctionId);
        return auction != null ? auction.getBids() : Collections.emptyList();
    }
}
```

### 📄 `model/Auction.java`

```java
package com.you.lld.problems.auction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Auction {
    private final String id;
    private final String itemId;
    private final String sellerId;
    private final BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private AuctionStatus status;
    private String winningBidderId;
    private final List<Bid> bids;
    
    public Auction(String id, String itemId, String sellerId, BigDecimal startingPrice,
                   LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.currentPrice = startingPrice;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = AuctionStatus.SCHEDULED;
        this.bids = new ArrayList<>();
    }
    
    public synchronized boolean placeBid(Bid bid) {
        if (status != AuctionStatus.ACTIVE) {
            return false;
        }
        
        if (bid.getAmount().compareTo(currentPrice) <= 0) {
            return false;
        }
        
        bids.add(bid);
        currentPrice = bid.getAmount();
        winningBidderId = bid.getBidderId();
        return true;
    }
    
    public void start() {
        this.status = AuctionStatus.ACTIVE;
    }
    
    public void end() {
        this.status = AuctionStatus.COMPLETED;
    }
    
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == AuctionStatus.ACTIVE && now.isBefore(endTime);
    }
    
    public String getId() { return id; }
    public String getItemId() { return itemId; }
    public String getSellerId() { return sellerId; }
    public BigDecimal getStartingPrice() { return startingPrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public AuctionStatus getStatus() { return status; }
    public String getWinningBidderId() { return winningBidderId; }
    public List<Bid> getBids() { return new ArrayList<>(bids); }
    
    @Override
    public String toString() {
        return "Auction{id='" + id + "', currentPrice=" + currentPrice + 
               ", bids=" + bids.size() + ", status=" + status + "}";
    }
}
```

### 📄 `model/AuctionStatus.java`

```java
package com.you.lld.problems.auction.model;

public enum AuctionStatus {
    SCHEDULED, ACTIVE, COMPLETED, CANCELLED
}
```

### 📄 `model/Bid.java`

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

### 📄 `model/BidStatus.java`

```java
package com.you.lld.problems.auction.model;

public enum BidStatus {
    PENDING, ACCEPTED, REJECTED, WINNING, OUTBID
}
```

### 📄 `model/Item.java`

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

