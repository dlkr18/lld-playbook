# 4-week LLD Plan (Java) — SDE-2 Depth

Time: 2–3h weekdays, 4–5h weekends. Each problem: requirements → UML → Java interfaces → tests → implementation → ADR.

## Week 1 — Foundations and OO modeling
- Day 1: Process: requirements → NFRs → domain → diagrams → APIs.
- Day 2: SOLID, GRASP, cohesion/coupling; refactor a God class.
- Day 3: UML: class/sequence/state diagrams (vending machine).
- Day 4: Value vs entity; immutability; money/time/ID types.
- Day 5: Error modeling; validation; builders; API contracts.
- Weekend: Parking Lot end-to-end with pricing policies and extensibility.

## Week 2 — Patterns and persistence
- Day 6: Creational patterns (Builder/Factory/Prototype).
- Day 7: Structural (Adapter/Decorator/Composite/Proxy/Flyweight).
- Day 8: Behavioral (Strategy/State/Template/Chain/Observer/Command).
- Day 9: Repository/UnitOfWork/Specification; DTO mapping.
- Day 10: Caching (LRU/LFU/TTL), consistency, stampede protection.
- Weekend: Elevator with schedulers (SCAN/SSTF), state machine and tests.

## Week 3 — Services and infra components
- Day 11: Rate limiter: token/leaky/sliding window; design and implement.
- Day 12: Notification service: providers, retries, templates, audit.
- Day 13: Feature flags/config; strategy rollout; API and storage.
- Day 14: In-memory KV store with WAL; snapshots; compaction basics.
- Day 15: Search/index on client vs server; E2EE implications.
- Weekend: BMS (BookMyShow) with holds, overbooking prevention, pricing.

## Week 4 — Advanced cases and interview drills
- Day 16: Splitwise: precision, graphs, settlements; concurrency of updates.
- Day 17: Chess/TicTacToe: rules engine, pluggable AI, replay persistence.
- Day 18: Logging/metrics library: API design; MDC; sinks; backpressure.
- Day 19: Review + refactor; apply patterns judiciously.
- Day 20: Mock interviews (2): whiteboard + coding-focused designs.
- Weekend: Capstone of choice; write ADRs and polish diagrams.

## Deliverables per problem
- README with requirements/NFRs.
- Class + sequence (+ state if lifecycle) diagrams.
- Interfaces with clean contracts; tests (units, contracts); one implementation.
- ADR documenting choices and trade-offs.
