# LLD Playbook (Java) — SDE-2 Prep

This repository is a 4-week, end-to-end preparation plan for Low-Level Design interviews in Java. It focuses on modeling, clean APIs, patterns, concurrency where relevant, and testability.

## What’s inside
- 4-week plan with daily deliverables and acceptance criteria (`docs/PLAN.md`).
- Problem set with starter skeletons (Parking Lot, Elevator, BMS, Notification, Splitwise, Library, LRU, Rate Limiter).
- Common module with reusable types (`Money`, IDs, results, error model) and testing helpers.
- JUnit 5 test setup; easy to run and extend.

## Build
- Tests: `mvn -q test`

## Structure
```
lld-playbook/
  pom.xml
  README.md
  docs/
    PLAN.md
    ADRs/
    TEMPLATES/
  src/
    main/java/com/you/lld/
      common/
      parkinglot/
      rateLimiter/
    test/java/com/you/lld/
      common/
```
