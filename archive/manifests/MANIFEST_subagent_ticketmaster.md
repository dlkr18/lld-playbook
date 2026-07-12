# MANIFEST — Ticketmaster HLD Cheatsheet (Subagent)

## File Created

| Path | Status |
|------|--------|
| `docs/cheatsheets/hld/ticketmaster.html` | ✅ Created |

## Variant

**Variant A** — Classic HLD system design (per `HLD_TEMPLATE.md`)

## Sections (16 nav items: 01, 01a, 01b, 02–14)

| # | Section ID | Title |
|---|------------|-------|
| 01 | `requirements` | Requirements (Functional + Non-Functional) |
| 01a | `coreentities` | Core Entities (9-row table) |
| 01b | `api` | API Design (REST + internal + idempotency keys) |
| 02 | `estimation` | Estimation (500K concurrent, 50K purchases/min, 10-min hold TTL) |
| 03 | `whyhard` | Why It's Hard (thundering herd, double-booking, inventory consistency) |
| 04 | `architecture` | Architecture (ASCII + main diagram + numbered flow) |
| 05 | `waitingroom` | Waiting Room / Virtual Queue |
| 06 | `seatmap` | Seat Map & Inventory (sharded by event_id, state machine) |
| 07 | `hold` | Hold / Reservation with CAS |
| 08 | `checkout` | Checkout & Payment (idempotent order, payment saga) |
| 09 | `hotscaling` | Hot Event Scaling |
| 10 | `antibot` | Anti-Bot & Abuse |
| 11 | `scaling` | Scaling (1× → 10× → 100×) |
| 12 | `edge` | Edge Cases |
| 13 | `realworld` | Real-World (Ticketmaster, SeatGeek, Queue-it, etc.) |
| 14 | `interview` | Interview Q&A (12 `<details>` entries; last = SDE2 vs SDE3) |

## Images Used (pre-existing, not regenerated)

| Relative Path | Placement |
|---------------|-----------|
| `img/ticketmaster-hld.png` | Hero, after tags (main HLD) |
| `img/ticketmaster-waiting-room-zoom.png` | Section 05 — Waiting Room deep dive |
| `img/ticketmaster-seat-cas-zoom.png` | Section 07 — Hold / CAS deep dive |

## Cross-Links

- `../concepts/concurrency-control.html`
- `../concepts/idempotency.html`
- `../tech/redis.html`
- `../tech/kafka.html`
- `rate-limiter.html` (same folder)

## Conventions Followed

- [x] CSS `<style>` block copied from `tinyurl.html`
- [x] Lightbox snippet copied verbatim from `job-scheduler.html` (before `</body>`)
- [x] Hero tags: Waiting Room, CAS, Seat Map, Idempotency, Flash Sale
- [x] Rich diagram captions for main HLD + both zoom diagrams
- [x] SDE3 interview depth (Redis SET NX, Postgres row locks, Kafka outbox, specific numbers)

## Verification Checklist

- [x] File exists at `docs/cheatsheets/hld/ticketmaster.html`
- [x] All 3 PNG images exist under `docs/cheatsheets/hld/img/`
- [x] 16 `<section id=...>` blocks present
- [x] 12 `<details>` Q&A entries (last = SDE2 vs SDE3 comparison)
- [x] 9 core entity rows (Event, Venue, SeatMap, Seat, Reservation, Order, User, WaitingRoomToken, Ticket)
- [x] Lightbox CSS + JS present before `</body>`
- [x] No `index.html` files modified
- [x] No git commit
- [x] No new PNG images generated
- [x] No Java code touched

## Not Done (intentionally per task scope)

- [ ] Register card on `docs/cheatsheets/hld/index.html`
- [ ] Register card on `docs/cheatsheets/index.html`
- [ ] Git commit / push
