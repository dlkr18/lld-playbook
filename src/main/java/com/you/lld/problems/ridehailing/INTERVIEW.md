# Ride Hailing — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an Uber-like system with riders, drivers, trip matching, surge pricing, cancellation fees, and ratings.

---

## 1. Clarifying Questions

- Trip lifecycle? (Requested → Accepted → InProgress → Completed / Cancelled.)
- Matching? (Nearest available driver — `MatchingStrategy`.)
- Pricing? (Flat base + surge decorator.)
- Cancellation? (Fee depends on state at cancel time.)
- Ratings? (Post-trip rider → driver.)
- Concurrent trips? (One active trip per driver.)
- Notifications? (Observer on trip state change.)

---

## 2. Functional Requirements

1. **Register** riders and drivers with location/status.
2. **Request ride** — pickup, dropoff → trip in Requested state.
3. **Match driver** — assign nearest available driver.
4. **Accept/start/complete** — driver advances trip states.
5. **Pricing** — estimate and final fare via `PricingStrategy`.
6. **Cancel** — rider or driver; compute cancellation fee by state.
7. **Rate** — store rating after completion.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | Fine-grained lock per trip; driver status atomic updates |
| **Extensibility** | Swappable matching and pricing strategies |
| **Correctness** | State guards invalid transitions |
| **Geo** | Distance-based matching (Haversine in impl) |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Rider`, `Driver` | model | Users | Location, status |
| `Trip` | model | Ride aggregate | Pickup/dropoff, state, fare |
| `TripState` | model | Lifecycle enum/object | Requested, Accepted, etc. |
| `Rating` | model | Feedback | Score, comment |
| `TripService` | service | API | request, accept, start, complete, cancel |
| `InMemoryTripService` | impl | Core logic | Trip map, driver pool |
| `MatchingStrategy` | service | Driver pick | Nearest available |
| `PricingStrategy` | service | Fare calc | Flat + surge decorator |
| `RideHailing` | orchestrator | Facade | Wires service for demo |

---

## 5. Relationships

- `RideHailing` **delegates** to `InMemoryTripService`.
- `Trip` **references** rider and optional assigned driver.
- `MatchingStrategy` **reads** driver registry filtered by AVAILABLE.
- `PricingStrategy` **computes** fare from distance, duration, surge multiplier.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (trip lifecycle) | Cancel fee rules depend on phase — encapsulated per state |
| **Strategy** (matching, pricing) | City-specific rules without service fork |
| **Decorator** (surge on pricing) | Layer surge without duplicating base fare logic |
| **Observer** (notifications) | Push updates to rider/driver apps |

---

## 7. Key Implementation Details

### 7.1 Per-trip locking

`synchronized(trip)` or trip-level lock on state transitions prevents double-accept race.

### 7.2 Surge pricing

Decorator wraps base `PricingStrategy`, multiplies fare when demand/supply ratio exceeds threshold.

### 7.3 Cancellation fee

`Cancelled` from Requested = free; from Accepted/InProgress = flat or percentage per policy.

---

## 8. Likely Follow-Up Q&A

**Q: No drivers nearby?**  
A: Return retryable error; expand radius iteratively.

**Q: Driver goes offline mid-trip?**  
A: Force cancel + reassign — ops extension.

**Q: Pool/shared rides?**  
A: Match multiple riders on route — separate matching strategy.

**Q: Payment hold?**  
A: Pre-auth on accept, capture on complete.

**Q: Geospatial index?**  
A: Quadtree or geohash for driver lookup vs O(n) scan.

**Q: Split fare?**  
A: Post-trip ledger — reuse Splitwise pattern.

**Q: Idempotent request?**  
A: Client requestId dedupes duplicate taps.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Nearest driver | Fast pickup; ignores driver quality |
| Surge decorator | Clean layering; composite pricing order matters |
| In-memory geo | Demo OK; Redis GEO for production |
| State enum vs classes | Enum simpler here; classes if per-state behavior grows |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ridehailing.RideHailingDemo"`
