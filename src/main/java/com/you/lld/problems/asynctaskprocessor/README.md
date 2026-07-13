# Async Task Processor (+ scheduling extension)

**One-liner:** A hand-rolled async executor — `submit(task)` returns a `TaskHandle` (future)
while a worker pool runs it off the calling thread — **extended** to schedule tasks after a
delay, at a specific instant, and at a fixed repeating interval.

## Package structure

```
asynctaskprocessor/
├── model/
│   ├── TaskStatus                 # PENDING -> RUNNING -> COMPLETED | FAILED | CANCELLED
│   └── TaskExecutionException     # wraps what a task threw, surfaced from get()
├── service/
│   ├── TaskHandle<T>              # the future/promise: get(), status(), cancel()
│   ├── TaskProcessor              # PART 1 — submit(...) + shutdown()
│   └── ScheduledTaskProcessor     # PART 2 — scheduleAfter / scheduleAt / scheduleAtFixedRate
├── service/impl/
│   ├── DefaultTaskHandle          # future backed by a CountDownLatch
│   ├── WorkerPoolTaskProcessor    # PART 1 engine: BlockingQueue + N worker threads
│   └── ScheduledTaskEntry         # Delayed + TaskHandle; lives in the DelayQueue
├── AsyncTaskProcessor.java        # root: extends the pool, adds a DelayQueue scheduler
└── AsyncTaskProcessorDemo.java    # async + all 3 scheduling modes
```

## Patterns

| Pattern | Where | Why |
|---|---|---|
| **Producer–Consumer** | `WorkerPoolTaskProcessor` | submit = produce onto a BlockingQueue; workers consume |
| **Future / Promise** | `TaskHandle` / `DefaultTaskHandle` | hand back a result-handle immediately; caller never blocks the calling thread |
| **Command** | `Callable`/`Runnable` "boxes" | a task is a self-contained unit the pool executes uniformly |
| **Template/Extension** | `AsyncTaskProcessor extends WorkerPoolTaskProcessor` | build the async engine, then inherit + add scheduling |
| **State (light)** | `TaskStatus` on the handle | validated lifecycle; cancel only legal while PENDING |

## The two ideas that carry the design

1. **The future is a `CountDownLatch`.** `get()` awaits a latch; the worker counts it down
   exactly once (complete / fail / cancel). That single primitive gives blocking get, timed
   get, and safe publication of the result — no busy-waiting.

2. **The scheduler only decides WHEN; the pool does the WORK.** A single scheduler thread
   blocks on a `DelayQueue.take()` (which returns the earliest task only once it's *due* —
   O(log n), no polling), then **dispatches** the task to the inherited worker pool. So a slow
   task body never delays the firing of the next scheduled task. Fixed-rate re-inserts the
   entry with `nextRun += period` (cadence doesn't drift with run duration).

## Concurrency (this problem is *about* threads)

- **Shared state = the queues only.** `LinkedBlockingQueue` (work) and `DelayQueue` (schedule)
  are thread-safe, so producers, workers, and the scheduler need no extra locks.
- **Result publication** is via each handle's latch (happens-before).
- **Cancellation** is synchronized on the handle so a cancel racing a start yields exactly one
  winner; a task already RUNNING refuses cancel (we don't interrupt running work in v1).
- **Graceful shutdown**: stop the scheduler, then enqueue one POISON pill per worker so each
  exits *after* draining the real work ahead of it — no task is dropped or interrupted midway.

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.asynctaskprocessor.AsyncTaskProcessorDemo"
mvn -q test -Dtest=AsyncTaskProcessorTest    # 10 tests
```

## Interview talking points

1. **It's `ExecutorService` + `ScheduledExecutorService`, hand-built** — say that up front so
   the interviewer knows you know the JDK equivalents, then build them to show you understand
   the internals.
2. **DelayQueue is the scheduling trick** — the earliest-due task surfaces via a blocking
   `take()`; no polling loop, no busy spin.
3. **Scheduler dispatches, workers execute** — the separation is why one long task can't stall
   the whole schedule.
4. **Fixed-rate vs fixed-delay** — rate = `scheduledTime + period` (steady cadence);
   delay = `completionTime + period` (gap between runs). Know both; I implemented fixed-rate.
5. **Follow-ups I'm ready for**: per-task priority (swap the work queue for a
   `PriorityBlockingQueue`), retries/backoff (wrap the box in a retry decorator + reschedule),
   `interrupt`-based cancellation of running tasks, bounded queue + rejection policy for
   backpressure, and persistence so schedules survive restart (the `DelayQueue` becomes a
   durable store the scheduler rebuilds on boot).
```
