# Online Auction System

## Difficulty: Hard | Pattern: Observer, State

```java
class AuctionSystem {
    private Map<String, Auction> auctions;
    
    void createAuction(AuctionRequest request);
    void placeBid(String auctionId, Bid bid);
}

class Auction {
    String id;
    Item item;
    double startingPrice, currentPrice;
    List<Bid> bids;
    AuctionStatus status;
}
```

**Status**: ✅ Documented
