# Parking Lot — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a multi-floor parking lot that allocates spaces by vehicle type, issues tickets, charges on exit, and supports admin reporting.

---

## 1. Clarifying Questions

- Single lot or multi-location? (Assume one lot, multiple floors.)
- Vehicle types and space types? (Motorcycle, car, truck/bus; compact, large, motorcycle, disabled.)
- Payment before exit mandatory? (Yes — space freed only after successful payment.)
- Lost ticket policy? (Charge max daily rate.)
- Real-time occupancy for admins? (Yes — per-floor reports.)
- Concurrency at entry gate? (Multiple lanes, no double-booking.)
- Pricing model? (Hourly by vehicle type; pluggable strategy.)
- Disabled spaces — reserved or preference? (Reserved for permitted vehicles.)

---

## 2. Functional Requirements

1. **Entry** — validate vehicle, allocate compatible space, issue ticket with entry time and space ID.
2. **Exit** — validate ticket, compute fee, process payment, vacate space, close ticket.
3. **Space management** — floors contain typed spaces; track occupied vs available.
4. **Allocation** — match vehicle type to space priority (e.g., motorcycle → motorcycle > compact > large).
5. **Payment** — cash/card/mobile; receipt; fail-safe exit (no vacate on payment failure).
6. **Admin** — add floors/spaces, occupancy report, configure pricing/allocation strategies.
7. **Events** — notify listeners on enter/exit/payment (Observer).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | CAS on `ParkingSpace.tryOccupy()`; `putIfAbsent` on plate→ticket map; no double entry |
| **Consistency** | Space vacated only after payment succeeds |
| **Scale** | 10k+ spaces; 1k+ concurrent vehicles (in-memory demo; DB + distributed lock in prod) |
| **Extensibility** | Pluggable `PricingStrategy`, `SpaceAllocationStrategy`, `PaymentProcessor` |
| **Latency** | Entry/exit < 2s (interview scope: O(floors × spaces) scan acceptable with indexing follow-up) |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `ParkingLot` | model | Root aggregate | Holds list of `Floor`; lookup spaces by ID |
| `Floor` | model | Floor container | Collection of `ParkingSpace` |
| `ParkingSpace` | model | Single slot | Type, occupied flag; `tryOccupy()` CAS |
| `Vehicle` | model | Entry identity | License plate, `VehicleType` |
| `ParkingTicket` | model | Entry proof | Ticket ID, space, entry time, payment link |
| `Payment` | model | Transaction | Amount, method, status |
| `ParkingService` | service | Public API | enter, exit, pay, reports |
| `InMemoryParkingService` | impl | Orchestrator | Ticket maps, listener fan-out, retry allocation |
| `HourlyPricingStrategy` | impl | Fee calculation | Duration × rate by vehicle type |
| `NearestSpaceAllocationStrategy` | impl | Space picker | Priority list by vehicle type, nearest floor first |
| `SimplePaymentProcessor` | impl | Payment gateway | Simulated authorize/capture |
| `ParkingEventListener` | service | Observer hook | onEnter, onExit, onPayment |

---

## 5. Relationships

- `InMemoryParkingService` **owns** `ParkingLot` and **uses** pricing, allocation, payment strategies.
- `ParkingLot` **aggregates** `Floor` **aggregates** `ParkingSpace`.
- `ParkingTicket` **references** one `ParkingSpace` and optional `Payment`.
- `Vehicle` **maps to** at most one active ticket via license plate index.
- Listeners **observe** service lifecycle events (decoupled logging/metrics).

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`PricingStrategy`, `SpaceAllocationStrategy`) | Swap hourly vs flat vs dynamic pricing without changing service |
| **Strategy** (`PaymentProcessor`) | Mock vs real PSP; vs hard-coded if/else per method |
| **Observer** (`ParkingEventListener`) | vs embedding logging in service — Open/Closed for new subscribers |
| **Composite** (Lot → Floor → Space) | Uniform traversal for occupancy; vs flat list losing hierarchy |

---

## 7. Key Implementation Details

### 7.1 Concurrent space allocation

Allocation loops up to `MAX_ALLOCATION_RETRIES`: strategy picks candidate space → `tryOccupy()` CAS. On failure (race), retry with next candidate. Prevents two threads booking the same slot.

### 7.2 Entry idempotency by plate

`plateToActiveTicketId.putIfAbsent(license, ticketId)` — second concurrent entry for same vehicle fails fast.

### 7.3 Fail-safe exit

Order: validate ticket → calculate fee → **payment** → `space.vacate()` → move ticket to closed map. Payment exception leaves vehicle parked — operator can retry.

---

## 8. Likely Follow-Up Q&A

**Q: How prevent double-booking under load?**  
A: Per-space CAS + plate-level `putIfAbsent`; optional distributed lock per space in multi-node deployment.

**Q: How scale allocation beyond linear scan?**  
A: Index free spaces by `SpaceType` per floor (BitSet or free-list); nearest-floor heuristic stays in strategy.

**Q: Lost ticket?**  
A: Lookup by license plate index; if missing, charge max daily rate from `PricingStrategy`.

**Q: Multiple payment methods?**  
A: `PaymentProcessor` strategy; service stays agnostic.

**Q: How test allocation priority?**  
A: Inject `NearestSpaceAllocationStrategy` with known floor layout; assert motorcycle gets motorcycle slot before compact.

**Q: Observer thread-safety?**  
A: `CopyOnWriteArrayList` for listeners; handlers should be non-blocking or async.

**Q: Disabled spaces?**  
A: Allocation strategy skips or requires permit flag on `Vehicle` (extension point).

**Q: Multi-lot?**  
A: Map of lotId → `ParkingService` instance; shared strategies optional.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory maps | Fast interview demo; prod needs DB + optimistic locking |
| Linear space scan | Simple; index by type for large lots |
| CAS retry loop | Lock-free per space; vs global lot lock (simpler but serializes entry) |
| Payment before vacate | Safer revenue; vs vacate-first (faster gate, revenue risk) |
| Checked domain exceptions | Explicit API contract; vs unchecked for brevity |

**Demo:** `mvn compile exec:java -Dexec.mainClass="com.you.lld.problems.parkinglot.ParkingLotDemo"`
