# INTERVIEW.md — Async Task Processor (+ scheduling extension)

Full SDE2/SDE3 machine-coding walkthrough for: *"Design an async task processor, then extend
it to schedule task processing at a particular time and at an interval."*

---

## 0. How to read the question

It's a **two-part progression**, and the phrasing tells you the order:
1. **Async task processor** — submit work, run it off the caller's thread on a pool, hand back
   a result handle. This is a hand-built `ExecutorService`.
2. **Extend to scheduling** — run at a specific time, and repeatedly at an interval. This is a
   hand-built `ScheduledExecutorService`.

Say out loud: *"These are the JDK's `ExecutorService` and `ScheduledExecutorService`; I'll build
them so we can talk about the internals — a blocking work queue for part 1, a delay queue +
scheduler thread for part 2."* Building Part 1 with a clean seam is what makes Part 2 a small
extension rather than a rewrite.

## 1. Clarifying questions (2–3 min)

| Question | Why | Assumed answer |
|---|---|---|
| Do tasks return values, or fire-and-forget? | Future vs void | **Both** — `Callable<T>` and `Runnable` |
| Fixed pool size, or elastic? | Pool model | **Fixed** pool of N workers |
| Cancel semantics — can we interrupt a running task? | Cancellation scope | **Cancel only while queued**; don't interrupt running work in v1 |
| Fixed-rate or fixed-delay for periodic? | Reschedule formula | **Fixed-rate** (period from scheduled time); mention the other |
| Ordering / priority among ready tasks? | Queue choice | **FIFO** v1; priority is a follow-up (swap the queue) |
| Must schedules survive restart? | Persistence | **No** (in-memory); note the durable-store extension |

## 2. Requirements

**Functional:** submit a task and get a handle to await its result; report status; cancel a
queued task; run tasks concurrently on a worker pool; graceful shutdown. **Extension:** run once
after a delay, run once at an `Instant`, run repeatedly at a fixed rate (cancellable).

**Non-functional (this problem is *about* these):** correct concurrency (no lost results, no
double-run, no oversell of a slot), no busy-polling for scheduling, one slow task must not stall
the scheduler, clean shutdown with no dropped/half-run tasks.

## 3. Core entities

| Class | Layer | Internals |
|---|---|---|
| `TaskStatus` | model | PENDING→RUNNING→COMPLETED/FAILED, or PENDING→CANCELLED |
| `TaskHandle<T>` | service | the future: `get()`, `get(timeout)`, `status()`, `cancel()` |
| `DefaultTaskHandle<T>` | impl | latch-backed future; synchronized state transitions |
| `TaskProcessor` | service | Part 1 contract: `submit`, `shutdown` |
| `ScheduledTaskProcessor` | service | Part 2 contract: `scheduleAfter/At/AtFixedRate` |
| `WorkerPoolTaskProcessor` | impl | Part 1 engine: `LinkedBlockingQueue` + N worker threads |
| `ScheduledTaskEntry` | impl | `Delayed` **and** `TaskHandle`; sits in the `DelayQueue` |
| `AsyncTaskProcessor` | root | `extends` the pool; adds a `DelayQueue` + one scheduler thread |

## 4. Patterns — and why over alternatives

- **Producer–Consumer** (`BlockingQueue` + workers): the textbook way to decouple submission
  rate from execution rate. *Alternative rejected:* spawning a thread per task — unbounded
  threads, no backpressure, GC/《context-switch》 thrash.
- **Future/Promise** (`TaskHandle`): lets `submit` return instantly. Backed by a
  `CountDownLatch` — the minimal primitive that gives blocking + timed `get()` and safe result
  publication. *Alternative rejected:* returning the value directly (that's synchronous), or a
  callback-only API (harder to compose/await).
- **Extension via inheritance** (`AsyncTaskProcessor extends WorkerPoolTaskProcessor`): the
  question literally says "extend", and the scheduler reuses the pool's `execute`. Clean split
  of Part 1 / Part 2.
- **`Delayed` + `DelayQueue`** for scheduling: `take()` blocks until the earliest task is due —
  no polling. *Alternative rejected:* a `sleep`-poll loop (wastes CPU, imprecise) or a
  `ScheduledThreadPoolExecutor` (that's the thing we're being asked to build).

## 5. Key implementation details (the 3 to walk through)

**a) The future is a latch.**
```java
// worker completes it; get() awaits it
synchronized void complete(T v){ if(status!=RUNNING) return; result=v; status=COMPLETED; done.countDown(); }
public T get() throws InterruptedException { done.await(); return resultOrThrow(); }
```
`start()`/`complete()`/`fail()`/`cancel()` are synchronized so exactly one terminal outcome
wins; the latch gives happens-before so `get()` safely sees `result`.

**b) The pool — producer/consumer + graceful shutdown.**
```java
// worker loop
Runnable r = queue.take();          // block for work
if (r == POISON) return;            // stop AFTER draining what's ahead of it
r.run();
// shutdown(): accepting=false; enqueue one POISON per worker; join all
```
POISON pills (vs interrupting) mean queued work still runs and nothing dies mid-task.

**c) The scheduler — decide-when vs do-work.**
```java
ScheduledTaskEntry e = delayQueue.take();   // returns only once DUE (blocking, O(log n))
if (e.isCancelled()) continue;
execute(e::runOnce);                         // DISPATCH to the worker pool, don't run here
if (e.isPeriodic() && !e.isCancelled()) { e.reschedule(); delayQueue.put(e); } // nextRun += period
```
The scheduler thread never executes a task body → a slow task can't delay the next fire. Fixed-
rate advances `nextRun` from the scheduled time, so cadence doesn't drift.

## 6. Likely follow-ups + answers

- **"Task priority?"** — swap the work `LinkedBlockingQueue` for a `PriorityBlockingQueue` with
  a `Comparator` on task priority. Watch for starvation of low-priority tasks (age-boost).
- **"Retry with backoff on failure?"** — wrap the box in a retry decorator: on exception,
  re-schedule via `scheduleAfter(name, task, backoff(attempt))`, cap attempts, then dead-letter.
- **"Cancel a *running* task?"** — track the worker `Thread` per running task; `cancel(true)`
  interrupts it; the task body must be interrupt-aware. Trade-off: interrupting shared/IO work
  is dangerous — that's why v1 only cancels queued tasks.
- **"Backpressure / bounded queue?"** — bound the queue; on full, apply a rejection policy
  (block the producer, drop-oldest, or reject with an exception) — same choices as
  `ThreadPoolExecutor`.
- **"fixed-rate vs fixed-delay?"** — rate = `scheduledTime + period` (steady beat, can bunch up
  if runs overrun); delay = `completionTime + period` (steady gap). I built fixed-rate; the
  switch is one line in `reschedule()`.
- **"Survive process restart?"** — persist scheduled entries (DB/Redis sorted-set by next-run);
  on boot the scheduler rebuilds the `DelayQueue` from the store; mark runs idempotent so a
  crash mid-run doesn't double-execute. (This is how a distributed job scheduler like Quartz /
  the earlier `taskscheduler` problem scales out.)
- **"Distribute across machines?"** — the `DelayQueue` becomes a shared store + a leased/claimed
  ready-queue (Kafka/SQS); workers are separate processes; add heartbeats + at-least-once +
  idempotency. (Crosses into HLD.)

## 7. Trade-offs made deliberately

| Chose | Over | Because |
|---|---|---|
| Fixed thread pool | thread-per-task | bounded resources, backpressure |
| `CountDownLatch` future | `wait/notify` by hand | fewer footguns; timed await built in |
| Cancel only when queued | interrupt running | interrupting shared/IO work is unsafe; simpler + correct |
| POISON-pill shutdown | interrupt workers | drains queued work; nothing half-run |
| DelayQueue | sleep-poll loop | precise, O(log n), zero busy-wait |
| Inheritance (pool → scheduled) | one monster class | mirrors the "build then extend" arc; reuses the pool |

## 8. 90-minute pacing (Harness format)

| Time | Do |
|---|---|
| 0–7 | Clarify (§1); name the JDK equivalents; agree Part-1-then-Part-2 plan |
| 7–15 | Sketch: TaskHandle (future) + BlockingQueue + workers; then DelayQueue + scheduler |
| 15–40 | **Part 1**: `TaskHandle`/`DefaultTaskHandle` (latch), `WorkerPoolTaskProcessor` (workers, submit, POISON shutdown) + a running demo (submit/get/fail/cancel) |
| 40–65 | **Part 2**: `ScheduledTaskEntry` (Delayed), `AsyncTaskProcessor extends` pool + scheduler loop; scheduleAfter/At/AtFixedRate |
| 65–78 | Demo the schedule modes + fixed-rate cancel; a few concurrency tests (barrier, drain-on-shutdown) |
| 78–90 | Follow-up they inject (priority / retry / running-cancel / fixed-delay) — talk + small change |

**If time collapses:** ship Part 1 fully (submit→future→pool→shutdown) running, then just
`scheduleAfter` for Part 2. Never cut the runnable demo or the graceful-shutdown story — the
whole point of the problem is that you got the threading right.
```
