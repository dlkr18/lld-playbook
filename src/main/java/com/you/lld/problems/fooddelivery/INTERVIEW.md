# Food Delivery — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a food delivery platform with restaurant orders, delivery partner assignment, order state machine, and tracking notifications.

---

## 1. Clarifying Questions

- Actors? (Customer, restaurant, delivery partner.)
- Order lifecycle? (Placed → Confirmed → Preparing → Ready → OutForDelivery → Delivered / Cancelled.)
- Partner matching? (Nearest available partner — Haversine distance strategy.)
- Fees? (Delivery fee calculation strategy.)
- Notifications? (Customer/restaurant on state change — Observer.)
- Restaurant hours? (Reject order if closed.)
- Cancellation? (Allowed in early states only.)

---

## 2. Functional Requirements

1. **Browse menu** — restaurant items, availability.
2. **Place order** — cart items, delivery address, initial Placed state.
3. **Restaurant confirm/prepare** — state transitions with validation.
4. **Assign partner** — match nearest available `DeliveryPartner`.
5. **Pickup & deliver** — OutForDelivery → Delivered.
6. **Track order** — query status and partner location (demo: status only).
7. **Cancel** — valid only from early states; notify observers.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Correctness** | State pattern blocks illegal transitions |
| **Extensibility** | Matching and fee strategies swappable |
| **Decoupling** | `OrderObserver` / `NotificationService` for side effects |
| **Concurrency** | Service-level sync on order updates |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Customer`, `Restaurant`, `DeliveryPartner` | model | Actors | Profiles, status enums |
| `MenuItem`, `OrderItem`, `Address` | model | Order composition | Line items, geo address |
| `Order` | model | Aggregate | Items, state object, partner ref |
| `OrderState` + concrete states | model | State pattern | Placed, Confirmed, Preparing, etc. |
| `OrderObserver` | model | Observer | onStatusChange callback |
| `FoodDeliveryService` | service | API | place, update, assign, cancel |
| `InMemoryFoodDeliveryService` | impl | Orchestrator | Registries, state transitions |
| `NotificationService` | service | Alerts | Console impl for demo |
| `OrderNotifier` | impl | Observer impl | Bridges order → notifications |

---

## 5. Relationships

- `Order` **delegates** lifecycle to current `OrderState` instance.
- `InMemoryFoodDeliveryService` **owns** restaurants, partners, orders map.
- State transitions **notify** `OrderObserver` list.
- Partner assignment **reads** available partners near restaurant address.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (`OrderState`) | Each phase defines allowed ops — vs switch on enum |
| **Strategy** (nearest partner, fees) | Swap matching algo without order class changes |
| **Observer** (`OrderObserver`) | SMS/push/analytics decoupled from core flow |

---

## 7. Key Implementation Details

### 7.1 State-driven transitions

`order.confirm()` calls `state.confirm(order)` which returns next state or throws `InvalidOperationException`.

### 7.2 Nearest partner matching

Filter `PartnerStatus.AVAILABLE`; compute Haversine distance to restaurant; pick minimum.

### 7.3 Cancellation guard

Only `PlacedOrderState` / `ConfirmedOrderState` allow cancel — prevents cancel after food prepared.

---

## 8. Likely Follow-Up Q&A

**Q: Partner rejects assignment?**  
A: Retry next nearest; or return to ReadyForPickup queue.

**Q: Estimated delivery time?**  
A: Strategy using distance + restaurant prep SLA.

**Q: Peak load?**  
A: Partner pool sharding by zone; async order queue.

**Q: Payment integration?**  
A: Payment before Confirmed or on Delivered — product choice.

**Q: Multi-restaurant order?**  
A: Out of scope — split into child orders.

**Q: Real-time tracking?**  
A: Partner publishes GPS; customer subscribes via WebSocket.

**Q: Inventory?**  
A: Decrement menu item stock on confirm; rollback on cancel.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| State classes | Verbose; clear illegal transition errors |
| Nearest partner | Low latency; ignores partner rating/load |
| In-memory | Simple; event sourcing for prod audit |
| Sync notifications | Demo ease; async queue for scale |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.fooddelivery.FoodDeliveryDemo"`
