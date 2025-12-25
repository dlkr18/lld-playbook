# Auction

## 19 Files

### Auction.java
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

### AuctionSystem.java
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

### Bid.java
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

### Demo.java
```java
package com.you.lld.problems.auction;
public class Demo { public static void main(String[] args) { System.out.println("Auction"); } }
```

### Service.java
```java
package com.you.lld.problems.auction.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.auction.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.auction.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.auction.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.auction.impl;
import com.you.lld.problems.auction.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.auction.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.auction.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.auction.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.auction.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.auction.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.auction.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.auction.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.auction.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

### Model8.java
```java
package com.you.lld.problems.auction.model;
public class Model8 { private String id; public Model8(String id) { this.id=id; } }
```

### Model9.java
```java
package com.you.lld.problems.auction.model;
public class Model9 { private String id; public Model9(String id) { this.id=id; } }
```

