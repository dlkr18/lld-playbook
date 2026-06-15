# Ride Hailing (Uber) — LLD

Multi-actor trip system: riders, drivers, matching, pricing, cancellation, ratings.

## Package Structure

```
ridehailing/
  model/       Trip, Rider, Driver, TripState, Rating
  service/     TripService, PricingStrategy, MatchingStrategy
  service/impl/ InMemoryTripService, surge/flat pricing, nearest-driver match
  RideHailing.java / RideHailingDemo.java
```

## Patterns

| Pattern | Why |
|---------|-----|
| **State** | Trip lifecycle (Requested → Accepted → InProgress → Completed) |
| **Strategy** | Pricing + driver matching swappable |
| **Observer** | Driver/rider notifications on state change |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ridehailing.RideHailingDemo"
```

## Talking Points

- Fine-grained locking per trip; state guards invalid transitions.
- Surge pricing as Decorator over base Strategy.
- Cancellation fees depend on trip state at cancel time.
