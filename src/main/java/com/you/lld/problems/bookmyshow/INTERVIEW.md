# BookMyShow — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a movie ticket booking system with seat selection, concurrent seat locking, pricing, payment, and notifications.

---

## 1. Clarifying Questions

- Booking unit? (Seat on a `Show` at `Screen` in `Theater`.)
- Concurrency? (Two users must not book same seat — `SeatLockManager`.)
- Lock timeout? (TTL releases held seats if checkout abandoned.)
- Pricing? (Simple flat vs dynamic strategy.)
- Payment flow? (Confirm after lock; release on failure.)
- Cities/theaters? (Multi-city catalog in-memory.)
- Notifications? (Email/SMS/multi-channel strategy.)

---

## 2. Functional Requirements

1. **Browse** — movies, theaters, shows by city/date.
2. **Seat map** — show available/locked/booked per seat.
3. **Hold seats** — lock selected seats for user with timeout.
4. **Confirm booking** — payment + mark seats BOOKED.
5. **Cancel** — release seats, update booking status.
6. **Pricing** — compute total via `PricingStrategy`.
7. **Notify** — send confirmation via `NotificationStrategy`.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | Per-seat locks; lock manager with expiry sweep |
| **Consistency** | No double booking; lock before payment |
| **Extensibility** | Pluggable pricing and notification strategies |
| **Cache** | LRU `MovieCache` for hot movie metadata |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Movie`, `Theater`, `Screen`, `Show` | model | Catalog | Hierarchical show scheduling |
| `Seat`, `SeatType` | model | Bookable unit | Row, number, type, status |
| `User`, `Booking`, `Payment` | model | Transaction | User holds booking lifecycle |
| `BookingService` | service | API | search, lock, confirm, cancel |
| `EnhancedBookingService` | impl | Main service | In-memory maps, orchestration |
| `SeatLockManager` | impl | Concurrency | Per-seat lock + timeout registry |
| `PricingStrategy` | service | Fee rules | Simple / dynamic impls |
| `NotificationStrategy` | service | Alerts | Email / SMS / composite |
| `MovieCache` | cache | LRU decorator | Fast movie lookup |

---

## 5. Relationships

- `Theater` **contains** `Screen` **hosts** `Show` **owns** `Seat` grid.
- `EnhancedBookingService` **uses** `SeatLockManager`, pricing, notifications.
- `Booking` **references** show + seat IDs + user.
- Lock manager **maps** seatId → lock owner + expiry.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (pricing, notifications) | A/B pricing, channel mix without service change |
| **Value Object** (`Money` from common) | Precise currency arithmetic |
| **Cache** (`MovieCache`) | Decorator for read-heavy movie catalog |

---

## 7. Key Implementation Details

### 7.1 Seat lock with TTL

On lock: mark seat LOCKED, record expiry timestamp. Background or lazy sweep releases expired locks back to AVAILABLE.

### 7.2 Confirm path

Validate locks still owned by user → create `Payment` → on success set BOOKED; on failure release locks.

### 7.3 Per-seat granularity

Finer than show-level lock — maximizes concurrency across different seats.

---

## 8. Likely Follow-Up Q&A

**Q: Thundering herd on popular show?**  
A: Queue or token for lock attempt; optimistic version on seat row.

**Q: Distributed locks?**  
A: Redis SET NX EX per seatId; DB unique constraint (show_id, seat_id) where status=BOOKED.

**Q: Waitlist?**  
A: Queue on sold-out show; notify on cancel — Observer on booking cancel.

**Q: Dynamic pricing?**  
A: `DynamicPricingStrategy` uses occupancy % and time-to-show.

**Q: Partial seat selection failure?**  
A: All-or-nothing lock in one transaction; rollback held seats on any conflict.

**Q: Idempotent confirm?**  
A: Client token on confirm API; duplicate returns same booking.

**Q: Admin block seats?**  
A: Seat status MAINTENANCE excluded from allocation.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory locks | Fast demo; Redis/DB for multi-instance |
| TTL hold | Reduces ghost availability; short window pressures user |
| Per-seat lock | High concurrency; more lock records than row-level |
| Strategy pricing | Flexible; needs guardrails against negative prices |

**Demo:** `mvn compile exec:java -Dexec.mainClass="com.you.lld.problems.bookmyshow.impl.BookMyShowDemo"`
