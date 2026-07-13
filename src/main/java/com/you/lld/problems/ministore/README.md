# Mini-Store — Multi-Tenant E-Commerce (simplified Shopify)

**One-liner:** A multi-tenant store platform: many stores (tenants), each with an isolated
catalog + inventory, cart, and an all-or-nothing order flow with a pluggable payment gateway.
Inventory can never go negative.

## Package structure

```
ministore/
├── model/                       # entities + value objects (immutable where possible)
│   ├── Store                    #   a tenant
│   ├── Product                  #   catalog entry, carries storeId (isolation backbone)
│   ├── InventoryItem            #   MUTABLE stock; the "never oversell" guard lives in deduct()
│   ├── Cart / CartLine          #   bound to ONE store; merges quantities
│   ├── Order / OrderLine        #   frozen at order time (price/name snapshot)
│   ├── OrderStatus              #   PENDING -> CONFIRMED | CANCELLED
│   ├── Money                    #   BigDecimal value object, never negative
│   └── exceptions/              #   StoreException + NotFound / InsufficientInventory / PaymentDeclined
├── service/
│   ├── Repository<T,ID>         #   storage abstraction (in-memory now, DB later)
│   ├── PaymentGateway           #   the pluggable payment abstraction (Strategy)
│   └── PaymentRequest/Result    #   gateway DTOs (no card data)
├── service/impl/
│   ├── InMemoryRepository       #   map-backed storage
│   ├── ApprovingPaymentGateway  #   always approves
│   └── ThresholdPaymentGateway  #   declines over a limit (deterministic decline for tests)
├── MiniStore.java               # facade/orchestrator — owns repos, runs the flows
└── MiniStoreDemo.java           # 6 scenarios end-to-end
```

## Patterns

| Pattern | Where | Why |
|---|---|---|
| **Facade** | `MiniStore` | one entry point over stores/catalog/cart/orders; hides the wiring |
| **Strategy** | `PaymentGateway` | payment provider is pluggable/swappable at runtime |
| **Repository** | `Repository<T,ID>` | storage seam — in-memory today, JDBC/JPA later, zero caller change |
| **State (light)** | `Order` / `OrderStatus` | validated lifecycle; a CONFIRMED order can't be re-cancelled |
| **Value Object** | `Money` | correct money (BigDecimal, scale 2), value equality |

## The three ideas that carry the design

1. **Tenant isolation is enforced at one choke point** — `MiniStore.requireProduct(storeId, productId)`.
   Every product access goes through it; if the product's `storeId` doesn't match, it's
   `NotFound` — a tenant literally *cannot observe* another tenant's data. Cross-store cart
   adds and orders are impossible, not just discouraged.

2. **"Never oversell" is an invariant, not a check** — the guard lives *inside*
   `InventoryItem.deduct()`, so no code path can drive stock negative. Plus the order flow
   **validates every line before deducting any**, so a shortage on line 3 never half-commits
   lines 1–2.

3. **Order placement is a mini-saga (all-or-nothing)**:
   `validate all stock → deduct all → charge → on decline, roll back deductions + cancel;
   on approval, confirm + clear cart`. Payment failure leaves inventory exactly as it was.

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.ministore.MiniStoreDemo"
mvn -q test -Dtest=MiniStoreTest    # 14 tests
```

## Interview talking points

1. **Multi-tenancy = shared-schema + tenant-scoped access.** One set of tables/maps, every
   row tagged with `storeId`, every read filtered by it. Cheapest model; isolation is a
   discipline enforced in one method (`requireProduct`). Alternatives (schema-per-tenant,
   DB-per-tenant) are the scale-up answer — mention the trade-off.
2. **Catalog vs stock are split** (`Product` immutable, `InventoryItem` mutable) — price/name
   don't change when a unit sells, so they don't share an object.
3. **The saga rollback** is the money detail: validate-all-then-deduct-all gives atomicity
   single-threaded; payment decline triggers a compensating `restock`.
4. **Concurrency is the #1 follow-up** — under threads, check-then-deduct races and can
   oversell. Fix: make `InventoryItem.deduct` atomic (synchronize, or `AtomicInteger` CAS
   loop), and hold per-order the set of item locks in a consistent order. The seam is ready;
   v1 just doesn't turn it on (per the brief).
5. **Everything is swappable behind interfaces** — payment (`PaymentGateway`) and storage
   (`Repository`) — so this grows into a real system without rewrites.
