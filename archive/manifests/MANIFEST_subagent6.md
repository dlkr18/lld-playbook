# Subagent 6 — Variant C Concept Primer Cheatsheets

Owned 9 concept-primer cheatsheets (Variant C from the HLD template).
All files created at `docs/cheatsheets/concepts/`, all diagrams generated via
GenerateImage and copied into `docs/cheatsheets/concepts/img/`.

## Deliverables (9 HTML + 9 PNG)

| # | Topic | HTML | Diagram |
|---|---|---|---|
| 1 | SQL vs NoSQL                       | `docs/cheatsheets/concepts/sql-vs-nosql.html`                       | `docs/cheatsheets/concepts/img/sql-vs-nosql-hld.png` |
| 2 | Message Queue Patterns             | `docs/cheatsheets/concepts/message-queue-patterns.html`             | `docs/cheatsheets/concepts/img/message-queue-patterns-hld.png` |
| 3 | Load Balancing                     | `docs/cheatsheets/concepts/load-balancing.html`                     | `docs/cheatsheets/concepts/img/load-balancing-hld.png` |
| 4 | Transactions & Sagas               | `docs/cheatsheets/concepts/transactions-sagas.html`                 | `docs/cheatsheets/concepts/img/transactions-sagas-hld.png` |
| 5 | Concurrency Control                | `docs/cheatsheets/concepts/concurrency-control.html`                | `docs/cheatsheets/concepts/img/concurrency-control-hld.png` |
| 6 | Indexing Strategies                | `docs/cheatsheets/concepts/indexing-strategies.html`                | `docs/cheatsheets/concepts/img/indexing-strategies-hld.png` |
| 7 | Probabilistic Data Structures      | `docs/cheatsheets/concepts/probabilistic-data-structures.html`      | `docs/cheatsheets/concepts/img/probabilistic-data-structures-hld.png` |
| 8 | Idempotency                        | `docs/cheatsheets/concepts/idempotency.html`                        | `docs/cheatsheets/concepts/img/idempotency-hld.png` |
| 9 | Backpressure & Rate Limiting       | `docs/cheatsheets/concepts/backpressure-rate-limiting.html`         | `docs/cheatsheets/concepts/img/backpressure-rate-limiting-hld.png` |

## Structure (every file)

Variant C concept-primer skeleton, exactly as specified in `HLD_TEMPLATE.md`
section 11:

- 01  What problem it solves
- 01a Core Vocabulary (term → definition table)
- 02  Approaches (tradeoff matrix)
- 03  Diagram
- 04+ Deep Dives (4–7 per file)
- N-2 Where it shows up (cross-links to ../hld/..., ../tech/..., ../concepts/...)
- N-1 Common interview probes
- N   Interview Q&A (10–12 expandable `<details>`, including SDE-2 vs SDE-3 row)

Each file uses the consistent-hashing.html CSS verbatim (inline `<style>` minified
line), the same nav-with-scroll-spy layout, and the lightbox snippet from
`job-scheduler.html` / `consistent-hashing.html` at the end of the document.

## Diagrams

All 9 diagrams generated via `GenerateImage` with the whiteboard-style prompt
(white background, dark blue/black ink, blue/orange/green/pink/purple highlights,
hand-drawn arrows, sticky-note callouts, JetBrains Mono labels, legend). Saved
to `assets/` then `cp`'d to `docs/cheatsheets/concepts/img/`.

| Diagram | What it shows |
|---|---|
| `sql-vs-nosql-hld.png` | 5-family × 6-dimension comparison matrix + decision flowchart |
| `message-queue-patterns-hld.png` | P2P / pub-sub / work-queue-with-visibility-timeout / delay-queue side-by-side |
| `load-balancing-hld.png` | Full stack: client → GeoDNS/Anycast → L4 → L7 → backend pool + algorithm table |
| `transactions-sagas-hld.png` | ACID vs 2PC vs Saga (choreography) vs Saga (orchestration) sequence diagrams |
| `concurrency-control-hld.png` | Pessimistic vs Optimistic (CAS) vs MVCC sequence diagrams, same race scenario |
| `indexing-strategies-hld.png` | 6 index types as visual structures (B-tree, hash, inverted, bitmap, BRIN, composite) |
| `probabilistic-data-structures-hld.png` | Bloom filter + HyperLogLog + Count-Min Sketch side by side with formulas |
| `idempotency-hld.png` | Request flow + retry flow with Idempotency-Key + Redis SETNX + 4-approaches panel |
| `backpressure-rate-limiting-hld.png` | 4 rate-limit algorithms side-by-side + backpressure menu + circuit-breaker FSM + 429 contract |

## Cross-Links

Every file's "Where it shows up" section links outward to `../hld/...`,
`../tech/...`, and sibling `../concepts/...` cheatsheets per the topic guidance.
Some links target files that may not exist yet — that's expected per rules
("many files might not exist yet, that's fine").

## Out of Scope (NOT done, per rules)

- No `index.html` edits
- No git commits
- No registration on landing pages
