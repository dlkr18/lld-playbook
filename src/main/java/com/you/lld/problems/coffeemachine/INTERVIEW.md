# Coffee Machine — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Two defects that reinforce each other. The machine **dispensed before taking
> payment** (§7.1), and the State pattern that should have prevented that was
> decorative — both transitions happened inside one call, so no caller could ever
> observe a state other than `IDLE` (§7.2).

---

## 1. Clarifying Questions (first 5 minutes)

1. **What's the transaction order?** Select → pay → dispense. Saying this out loud
   first is the whole problem: the code had it as select-and-dispense → pay.
2. **What if payment is short?** No drink, full refund, ingredients untouched.
3. **What if the customer overpays?** Change must be computed and returned. A vending
   machine that silently keeps the difference is theft.
4. **What if it runs out mid-transaction?** Full refund — never a partial charge.
   "Every path that takes money must have a path that returns it."
5. **Can two people order at once?** No — one physical machine, one order at a time.
   That's a state constraint, not just a lock.
6. **Can an order be cancelled?** Yes, before payment. Then `AWAITING_PAYMENT` needs
   an exit that isn't paying.
7. **Do we track cash inventory** (can it actually *make* change)? Out of scope here,
   and a good follow-up.

---

## 2. Functional Requirements

- Show a menu of beverages with prices and recipes.
- Select a beverage — verified against stock, consuming nothing.
- Pay: dispense on sufficient funds, refund and abort otherwise.
- Return change on overpayment.
- Cancel a selected order before paying.
- Refill ingredients; inspect levels.

## 3. Non-Functional Requirements

- **No ingredient is consumed before payment succeeds.**
- **Any failure after money is taken refunds in full.**
- Exact money — `BigDecimal`, never `double`.
- One order at a time, enforced by state rather than convention.
- Every declared state must be reachable *and observable*.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Beverage` / `BeverageType` | model | Name, `BigDecimal` price, and a recipe `Map<Ingredient, Integer>`. |
| `Ingredient` | model (enum) | `COFFEE`, `MILK`, `WATER`, … |
| `IngredientContainer` | model | Quantities + max capacities; `hasIngredients`, `consume` (all-or-nothing), `refill` (capped). |
| `Order` | model | Beverage, status, **`amountPaid`**, **`changeDue`**. |
| `OrderStatus` | model (enum) | `PENDING` → `IN_PROGRESS` → `COMPLETED` / `FAILED`. |
| `Payment` / `PaymentMethod` | model | Amount tendered and how. |
| `CoffeeMachineState` | state (interface) | `placeOrder`, `processPayment`, `cancelOrder`, `getStateName`. |
| `IdleState` | state | Accepts a selection → `AWAITING_PAYMENT`. |
| `AwaitingPaymentState` | state | Accepts payment or cancel; **rejects a second order**. |
| `DispensingState` | state | Rejects everything while brewing. |
| `CoffeeMachineService` / `CoffeeMachineImpl` | service | Menu, orders, container, and the transaction. |
| `CoffeeMachine` | root | Facade. |

---

## 5. Relationships

- `CoffeeMachineImpl` **has-a** `IngredientContainer`, a menu, an order registry, a
  `currentOrderId`, and a current `CoffeeMachineState`.
- All three states are **stateless singletons** — they hold no data, they just
  encode which operations are legal and what happens next. The machine holds the
  data; the state holds the rules.
- `Beverage` **owns its recipe**, so `consume(recipe)` is the only coupling between
  the menu and the hopper.
- The lifecycle:

```
IDLE ──placeOrder──▶ AWAITING_PAYMENT ──processPayment(enough)──▶ DISPENSING ──▶ IDLE
  ▲                        │  │                                                   │
  └────────cancelOrder─────┘  └──processPayment(short) ── refund ─────────────────┘
```

---

## 6. Design Patterns (name + why vs alternatives)

- **State — the machine lifecycle.** Each state decides what's legal, so "you can't
  order while awaiting payment" is enforced by the type currently installed rather
  than by a flag someone forgets to check. *Alternative:* an enum plus `if` chains
  in every method — which is effectively what the original had, since its states
  were unobservable. §7.2 is the cautionary tale: **having State classes is not the
  same as having a state machine.**
- **Singleton per state** — states carry no data, so one instance each.
- **All-or-nothing consumption** — `IngredientContainer.consume` checks everything
  before deducting anything, so a latte never takes the coffee and then fails on
  milk. That's the same validate-then-mutate discipline as `ministore`'s order saga.
- **Facade — `CoffeeMachine`.**
- *(Considered, rejected)* **Strategy for pricing/recipes.** Recipes are data on
  `Beverage`; a Strategy interface would add a layer over a map lookup.
- *(Considered, not built)* **Observer** for "low ingredient" alerts to an operator —
  the natural hook is `consume`, and it's the first thing a real machine needs.

---

## 7. Key Implementation Details

### 7.1 The machine dispensed before taking money (the headline)

`placeOrder` called `brewOrder`, which consumed ingredients and marked the order
`COMPLETED`. `processPayment` then ran *afterwards* and merely compared numbers:

```java
public boolean doProcessPayment(String orderId, Payment payment) {
    Order order = orders.get(orderId);
    return payment.getAmount().compareTo(order.getBeverage().getPrice()) >= 0;   // and nothing else
}
```

It returns a boolean that **no caller acts on and that changes no state**. Measured:

```
placeOrder(LATTE) -> status=COMPLETED
milk 500 -> 400, coffee 500 -> 480          *** consumed before any payment ***

paid 0.01 for a 3.50 latte -> processPayment returned false
order status now: COMPLETED
milk after failed payment: 400              *** free latte ***
```

And overpayment was simply kept — 20.00 for a 2.50 espresso produced no change
anywhere in the system.

Restructured so the order is: **verify stock → take money → dispense → return
change.**

```java
if (paid.compareTo(price) < 0) {
    order.recordPayment(BigDecimal.ZERO, paid);   // refund everything
    order.fail();
    finishOrder();
    return false;
}
setState(DispensingState.getInstance());
try {
    if (!container.consume(order.getBeverage().getRecipe())) {
        order.recordPayment(BigDecimal.ZERO, paid);   // ran dry: full refund, never a half-charge
        order.fail();
        return false;
    }
    order.recordPayment(price, paid.subtract(price));
    order.complete();
    return true;
} finally {
    finishOrder();                                     // always returns to IDLE
}
```

Verified end to end:

| scenario | result |
|---|---|
| after selecting | `AWAITING_PAYMENT`, milk untouched at 500 |
| pay 0.01 for a 3.50 latte | `FAILED`, refund 0.01, kept 0, milk still 500 |
| pay 20.00 for a 2.50 espresso | `COMPLETED`, charged 2.50, **change 17.50** |
| out of milk | refused at *selection*, before any money changes hands |

Two details worth defending:

- **Stock is checked at selection**, so the customer is told "out of milk" before
  paying rather than after. It's a check, not a reservation — the
  `AWAITING_PAYMENT` state already excludes a second order, so nothing can drain the
  hopper in between. On a multi-hopper or networked machine it would have to become a
  real reservation.
- **The `finally` block.** Whatever happens, the machine returns to `IDLE`. A vending
  machine stuck in `DISPENSING` because of an exception is bricked until someone
  power-cycles it.

### 7.2 The State pattern was decorative

`IdleState.placeOrder` did this:

```java
machine.setState(DispensingState.getInstance());
Order order = machine.brewOrder(beverage);
machine.setState(IdleState.getInstance());
```

Both transitions inside one `synchronized` method. `DispensingState` documented
itself as *"rejects concurrent orders"* — but it couldn't reject anything, because
no other thread could ever see it:

```
state before: IDLE
state after placeOrder: IDLE   *** DISPENSING is unobservable ***
```

Concurrency was actually handled by `synchronized` on the machine; the state class
was contributing nothing. So the pattern existed in the class diagram and not in the
behaviour — the same failure mode as `autocomplete`'s Strategy that never got to
decide anything.

Adding `AwaitingPaymentState` makes the machine a genuine state machine, because
there's now a state the system *rests in* between two external calls:

```
after selecting: AWAITING_PAYMENT
second order refused: Machine is awaiting payment for the current order — pay or cancel first
after cancel: IDLE
paying with nothing selected refused: No order is awaiting payment — select a beverage first
```

**The test for whether a State pattern is real:** can an external caller observe more
than one state? If every transition happens inside a single method call, you have
sequential code wearing a pattern's clothes.

`cancelOrder` was added for the same reason — a state you can only leave by
succeeding isn't a state, it's a step.

### 7.3 All-or-nothing ingredient consumption

```java
public synchronized boolean consume(Map<Ingredient, Integer> required) {
    if (!hasIngredients(required)) return false;     // check everything...
    for (...) quantities.put(ingredient, current - entry.getValue());   // ...then deduct
}
```

Both under one monitor, so a latte can never take the coffee and then discover
there's no milk. Combined with §7.1, the money and the ingredients now fail together
or succeed together — which is the actual correctness property, and worth naming as
such rather than describing the two fixes separately.

### 7.4 `BigDecimal`, and the downcast in the facade

Prices and payments are `BigDecimal` throughout — correct, and worth contrasting with
`paymentgateway` and `restaurant` in this repo, which use `double` and can't
reconcile to the cent.

The facade had `if (service instanceof CoffeeMachineImpl)` to reach `getStateName()`,
returning `"UNKNOWN"` for any other implementation. A downcast in a facade is always
the same symptom — an interface missing a method it should have. `getStateName()` and
`cancelOrder()` are now on `CoffeeMachineService`.

---

## 8. Likely Follow-ups (with concise answers)

- **Can it actually make the change it owes?** Not modelled — the machine computes
  `17.50` without checking it holds the coins. A real one tracks a coin inventory and
  refuses a sale it can't give change for, which is a nice extension of §7.1's
  "verify before taking money".
- **Payment fails at the card terminal** (rather than being short)? Same path as the
  out-of-stock branch: nothing consumed, nothing charged. Real card flows need
  authorize-then-capture, capturing only after the drink is dispensed.
- **Power cut mid-dispense?** The in-memory order is lost and the customer is charged
  for nothing. Needs a persisted transaction log and reconciliation on boot — the
  honest answer is that an in-memory machine cannot solve this.
- **Concurrent users?** `synchronized` on the machine plus `AWAITING_PAYMENT` is
  correct for one physical unit. Worth noting the two mechanisms do different jobs:
  the lock prevents interleaving, the state prevents a *logically* concurrent order.
- **Timeout on an abandoned order?** `AWAITING_PAYMENT` can be held forever, blocking
  the machine. A timer that auto-cancels after ~30s is what real machines do — and
  `asynctaskprocessor` in this repo is the scheduling machinery for it.
- **Customizations** (extra shot, oat milk)? Decorator over `Beverage`, adjusting
  price and recipe — the textbook use of the pattern, and genuinely appropriate here.
- **Low-ingredient alerts?** Observer on `consume`.
- **How would you test it?** The harness used here: assert ingredients are unchanged
  after selection, that a short payment leaves both the hopper and the till untouched,
  that change equals tendered − price exactly, and that the machine returns to `IDLE`
  on every path including failure.

---

## 9. Trade-offs

- **Check stock at selection, consume at payment:** better UX (told before paying) at
  the cost of a small TOCTOU window that only closes because the machine is
  single-order. A real reservation would be needed the moment that assumption breaks.
- **Three states rather than two:** one more class, in exchange for a state machine
  that actually constrains behaviour. The two-state version was strictly decorative.
- **Refund modelled as `changeDue` on the order:** simple and inspectable, but it
  represents "money owed" rather than money physically returned — no cash inventory,
  no dispense-failure handling. Named in §8.
- **Singleton states:** no allocation, no per-order state — fine because states hold
  nothing. If a state ever needed data (a payment timeout deadline), this would have
  to change.
- **`synchronized` on the machine:** correct and obvious for one physical device;
  meaningless as a scaling strategy, which is fine because the device doesn't scale.
- **In-memory orders:** loses the transaction on restart. Acceptable for the exercise,
  fatal for a machine that takes money — the one gap I'd raise unprompted.
