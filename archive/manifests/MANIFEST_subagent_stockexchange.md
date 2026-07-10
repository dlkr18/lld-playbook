# MANIFEST — Stock Exchange HLD Cheatsheet

## Deliverable

| Item | Path |
|------|------|
| HTML cheatsheet | `docs/cheatsheets/hld/stock-exchange.html` |

## Variant

**A — Classic HLD** (per `docs/cheatsheets/hld/HLD_TEMPLATE.md`)

## Sections (17 nav links / 14 numbered section groups)

| Nav # | Section ID | Title |
|-------|------------|-------|
| 01 | `requirements` | Requirements (functional + non-functional) |
| 01a | `coreentities` | Core Entities |
| 01b | `api` | API Design (FIX-like REST + WS market data) |
| 02 | `estimation` | Estimation (100M orders/day, 1M/sec peak, p99 <1ms) |
| 03 | `whyhard` | Why It's Hard |
| 04 | `architecture` | Architecture (ASCII + main diagram) |
| 05 | `orderbook` | Order Book Data Structure |
| 06 | `matching` | Matching Engine |
| 07 | `lifecycle` | Order Types & Lifecycle |
| 08 | `marketdata` | Market Data Fan-out |
| 09 | `durability` | Durability & Audit |
| 10 | `colocation` | Colocation & Latency |
| 11 | `scaling` | Scaling |
| 12 | `edge` | Edge Cases |
| 13 | `realworld` | Real-World |
| 14 | `interview` | Interview Q&A (12 `<details>` entries) |

## Images Used

| File | Placement |
|------|-----------|
| `img/stock-exchange-hld.png` | After hero, before section 01 |
| `img/stock-exchange-orderbook-zoom.png` | Section 05 — Order Book deep dive |
| `img/stock-exchange-matching-zoom.png` | Section 06 — Matching Engine deep dive |

## Cross-Links

- `../concepts/concurrency-control.html` — single-writer per symbol
- `../concepts/backpressure-rate-limiting.html` — market data fan-out
- `../tech/kafka.html` — trade/book event stream
- `../hld/distributed-message-queue.html` — multicast bus alternative

## Hero Tags

Order Book · Price-Time · Matching Engine · WAL · Market Data

## Conventions Followed

- [x] CSS `<style>` block copied from `tinyurl.html`
- [x] Lightbox snippet copied verbatim from `job-scheduler.html`
- [x] Structure follows HLD_TEMPLATE Variant A
- [x] `<pre>` blocks for order book ASCII and matching pseudocode
- [x] SDE3 depth: priority queues, single-writer, WAL replay, hot-symbol sharding

## Checklist

- [x] File created at required path
- [x] All 14 content sections present
- [x] 3 existing PNGs referenced (not regenerated)
- [x] 12 Interview Q&A `<details>` entries
- [x] Lightbox included before `</body>`
- [x] `index.html` NOT edited
- [x] No Java changes
- [x] No git commit

## Not Done (per instructions)

- Index registration (`docs/cheatsheets/hld/index.html`, `docs/cheatsheets/index.html`)
- Git commit / push
- PNG generation
