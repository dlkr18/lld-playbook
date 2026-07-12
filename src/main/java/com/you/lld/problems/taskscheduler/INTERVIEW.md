# Task Scheduler — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a scheduler that executes delayed tasks by priority with retries and a dead-letter queue.

---

## 1. Clarifying Questions

- Scheduling semantics? (Run at or after `scheduledTime`.)
- Priority? (Earlier time wins; tie-break higher `Priority` level.)
- Execution model? (Poller thread + worker thread pool.)
- Retries? (Re-queue with delay on failure until `maxRetries`.)
- Cancellation? (Remove from queue + volatile cancelled flag.)
- DLQ? (Tasks exceeding retries → dead-letter list.)
- Persistence? (In-memory — mention DB/job queue for prod.)

---

## 2. Functional Requirements

1. **Schedule** — submit `Runnable` or task with future time + priority.
2. **Execute due tasks** — poller moves ready tasks to workers.
3. **Priority ordering** — `ScheduledTask.compareTo` time then priority.
4. **Retry** — increment attempt; delay 1s (configurable) and re-enqueue.
5. **Dead letter** — append to DLQ after max retries exhausted.
6. **Cancel** — by task ID before run starts.
7. **Query DLQ** — list failed tasks for ops replay.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Time complexity** | O(log n) insert/poll via `PriorityQueue` |
| **Concurrency** | Poller single-threaded; worker pool parallel execution |
| **Reliability** | At-least-once with retry; idempotent tasks recommended |
| **Observability** | Task status + DLQ entries |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `ScheduledTask` | model | Work unit | ID, runnable, time, priority, attempts |
| `Priority` | model | Enum | HIGH, MEDIUM, LOW levels |
| `TaskStatus` | model | Lifecycle | PENDING, RUNNING, COMPLETED, FAILED, CANCELLED |
| `DeadLetterEntry` | model | DLQ record | Task snapshot + error |
| `TaskSchedulerService` | service | API | schedule, cancel, deadLetters |
| `PriorityTaskScheduler` | impl | Engine | PQ + executor + DLQ list |
| `TaskScheduler` | orchestrator | Facade | Demo wiring |

---

## 5. Relationships

- `TaskScheduler` **delegates** to `PriorityTaskScheduler`.
- Poller **polls** `PriorityQueue` when `scheduledTime <= now`.
- Workers **execute** `ScheduledTask.run()` and **report** success/failure.
- Failed tasks **re-enter** queue or **land** in `deadLetterQueue`.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Priority Queue** | Natural ordering for time + priority vs scanning all tasks |
| **Producer/Consumer** | Poller discovers work; pool executes — decouples timing from CPU |
| **Retry + DLQ** | Standard resilient job processing |

---

## 7. Key Implementation Details

### 7.1 Comparator

```text
compare: scheduledTime asc, then priority.level desc
```

### 7.2 Two-thread-pool architecture

Single-thread scheduled poller ticks ~1s; `ExecutorService` fixed pool runs task bodies concurrently.

### 7.3 Retry path

On exception: if `attemptCount < maxRetries`, increment, set `scheduledTime = now + backoff`, re-add to PQ; else create `DeadLetterEntry`.

---

## 8. Likely Follow-Up Q&A

**Q: Missed tasks during downtime?**  
A: Persistent store + on startup run overdue tasks.

**Q: Exactly-once?**  
A: Idempotency keys; distributed lock per task ID.

**Q: Cron expressions?**  
A: Layer cron parser that computes next fire time into `scheduledTime`.

**Q: Fairness among priorities?**  
A: Aging — boost priority of long-waiting LOW tasks.

**Q: Rate limiting workers?**  
A: Semaphore or smaller pool size.

**Q: Distributed scheduler?**  
A: Leader election for poller; workers anywhere; DB SKIP LOCKED.

**Q: Replay DLQ?**  
A: Admin API re-schedules with reset attempt count.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory PQ | Fast; lost on crash |
| 1s poll tick | Simple; sub-second jitter |
| Fixed backoff | Predictable; exponential better for flaky deps |
| Thread pool per scheduler | Good parallelism; pool sizing critical |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.taskscheduler.TaskSchedulerDemo"`
