# Vending Machine — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a vending machine that accepts coins/bills, selects products, dispenses change, and rejects invalid actions per lifecycle state.

---

## 1. Clarifying Questions

- Payment types? (Coins/bills as `BigDecimal` amounts — no physical hardware.)
- Change making? (Return excess after selection; cancel returns inserted money.)
- Inventory per slot? (Each `Slot` holds `Product` with quantity.)
- States? (Idle → HasMoney → ProductSelected → Dispensing → Idle.)
- Partial payment? (Stay in HasMoney until price met.)
- Concurrent users? (One machine instance — single-threaded state machine.)
- Out of stock? (Reject selection in HasMoney state.)

---

## 2. Functional Requirements

1. **Insert money** — accumulate balance in HasMoney state.
2. **Select product** — validate stock and sufficient balance → ProductSelected.
3. **Dispense** — decrement stock, compute change, return to Idle.
4. **Cancel** — refund inserted amount from HasMoney or ProductSelected.
5. **Reject invalid ops** — e.g., select product in Idle throws from state.
6. **Exact change warning** — optional flag if machine can't make change (extension).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Money precision** | `BigDecimal` — never `double` for currency |
| **Correctness** | State objects guard transitions |
| **Extensibility** | New states (maintenance, admin refill) = new class |
| **Simplicity** | Single machine, no network |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Product` | model | Sellable item | Name, price, category |
| `Slot` | model | Inventory cell | Product ref, quantity |
| `Money` | model | Value helper | BigDecimal utilities |
| `VendingMachine` | service | API | insertMoney, selectProduct, dispense, cancel |
| `VendingMachineImpl` | orchestrator | State host | Current state, balance, selected slot |
| `VendingMachineState` | state | Interface | All ops per phase |
| `IdleState` | state | No money | Accept insert only |
| `HasMoneyState` | state | Accumulating | Select or cancel |
| `ProductSelectedState` | state | Ready | Dispense or cancel |
| `DispensingState` | state | Transient | Completes vend, resets |

---

## 5. Relationships

- `VendingMachineImpl` **holds** current `VendingMachineState` and **delegates** every public method.
- States **mutate** machine fields (balance, selection) and **call** `setState()`.
- `Slot` **references** `Product`; dispense **decrements** quantity.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (`VendingMachineState`) | vs giant switch — each phase allows only valid ops; Open/Closed for Maintenance state |
| **Facade** (`VendingMachine` API) | Hides state transition details from client |

---

## 7. Key Implementation Details

### 7.1 State delegation

Every `VendingMachineImpl` method is `state.insertMoney(this, amount)` etc. Invalid op throws `IllegalStateException` from default or concrete state.

### 7.2 Dispense flow

ProductSelected → Dispensing: verify stock > 0, subtract price from balance, change = balance, zero balance, stock--, transition Idle.

### 7.3 BigDecimal comparisons

Use `compareTo` for price vs balance; never equality on doubles.

---

## 8. Likely Follow-Up Q&A

**Q: Add admin refill state?**  
A: New `RefillState` accepting inventory ops only; entered via key combo.

**Q: Can't make change?**  
A: Track coin inventory; before accept money run greedy feasibility check.

**Q: Multiple products selection?**  
A: Cart in HasMoney; dispense loops or new `CartSelectedState`.

**Q: Persistent inventory?**  
A: Repository behind slots; state machine unchanged.

**Q: Why State not Strategy?**  
A: Behavior is phase-sequential, not swappable algorithm.

**Q: Concurrent access?**  
A: `synchronized` methods on impl — one customer at a time.

**Q: Expired products?**  
A: Product metadata + check in selection.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| State pattern | Verbose for 4 states; scales better than if-else |
| BigDecimal | Correct money; slower than long cents |
| In-memory slots | Demo simplicity; DB for fleet management |
| Throw on invalid op | Clear failure; vs no-op silent ignore |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.vendingmachine.VendingMachineDemo"`
