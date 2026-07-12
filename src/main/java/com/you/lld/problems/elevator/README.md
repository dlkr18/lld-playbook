# Elevator System — LLD

Design a multi-elevator controller: hall calls, in-car floor selection, step simulation, SCAN/LOOK dispatch.

## Package Structure

```
elevator/
  model/       Elevator, Request, Direction, ElevatorStatus
  scheduler/   ElevatorScheduler, ScanElevatorScheduler, LookElevatorScheduler
  api/         ElevatorController
  impl/        OptimalElevatorController
  ElevatorSystem.java  Facade
  ElevatorDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `ElevatorScheduler` | Swap SCAN vs LOOK vs SSTF without changing controller. |
| **State** | `Elevator` direction/status | Elevator continues in direction until no destinations (SCAN behavior). |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.elevator.ElevatorDemo"
```

## Key Talking Points

- **SCAN** — prefer same-direction cars moving toward the request; else nearest idle.
- **LOOK** — stops reversing when no more requests ahead (variant in scheduler package).
- **Thread-safety** — `ConcurrentSkipListSet` for destination floors; controller maps are concurrent.
- **Simulation** — explicit `step()` tick for interview walkthrough without real threads.
