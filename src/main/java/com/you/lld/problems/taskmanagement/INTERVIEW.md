# Task Management (Jira/Trello-style) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> A task tracker is a **state machine with a query layer bolted on**. If you don't
> build the state machine, you've built a mutable struct with a status field — and
> §7.1 shows exactly what that costs.

---

## 1. Clarifying Questions (first 5 minutes)

1. **What's the workflow?** `TODO → IN_PROGRESS → IN_REVIEW → DONE`, plus
   `BLOCKED` from most states. The important follow-up: **which transitions are
   illegal?** `TODO → DONE` skipping all work should not be possible.
2. **Is review mandatory?** No — `IN_PROGRESS → DONE` directly is normal in most
   trackers. Worth confirming, because it's the difference between a linear
   pipeline and a graph.
3. **Can a DONE task be reopened?** Yes, and that has a consequence people miss:
   `completedAt` must be **cleared**, or every cycle-time report is wrong.
4. **Who can change what?** Roles exist (`UserRole`) but this scope is
   single-tenant; I'll note where authorization attaches.
5. **Subtasks / dependencies / blocking relationships?** Out of core scope; I'll
   name the shape (Composite for subtasks, DAG for dependencies).
6. **Notifications on change?** Yes — Observer, and it must be decoupled from the
   transition itself.
7. **Query patterns?** By status, assignee, priority, tag, overdue, created-between.
   That list is a strong hint about which indexes a real version needs.
8. **Concurrency?** Multiple users on one board, so yes.

---

## 2. Functional Requirements

- Create / update / delete tasks with title, description, priority, due date, tags.
- Assign a task to a user.
- **Transition status, rejecting illegal transitions.**
- Observers notified on status change (with old → new).
- Query by status, assignee, priority, tag; list overdue; list created in a range.

## 3. Non-Functional Requirements

- **Only legal transitions**, enforced in one place.
- **Derived fields stay consistent** — `completedAt` set on DONE, cleared on reopen.
- **No silent no-ops** — an unknown id is an error, not a shrug.
- **Thread-safe** task mutation; no lost tags, no contradictory transition events.
- Observers decoupled and fired without holding locks longer than needed.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Task` | model | Id, title, description, `TaskStatus`, `Priority`, assignee, tags (`CopyOnWriteArrayList`), `createdAt` / `dueDate` / `completedAt`. `setStatus` **validates** and maintains `completedAt`; `transitionTo` does read-and-write atomically. |
| `TaskStatus` | model (enum) | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED`, `DONE` — **and the legal-transition table**, via `canTransitionTo`. |
| `Priority` | model (enum) | LOW → CRITICAL. |
| `Comment` | model | Author + text on a task. |
| `User` / `UserRole` | model | Who does the work. |
| `Team` | model | Grouping of users. |
| `TaskObserver` | model (interface) | `onTaskStatusChanged(task, old, new)`. |
| `TaskService` | service (interface) | The contract. |
| `InMemoryTaskService` | service/impl | Task registry, id generator, observer list, query methods. |
| `TaskManagement` | root | Facade. |

---

## 5. Relationships

- `InMemoryTaskService` **owns** `tasks` (id → `Task`) and the observer list.
- `Task` **has-a** `TaskStatus`; the *enum* holds the transition rules, so the rules
  travel with the value rather than living in whichever service happens to mutate it.
- `TaskObserver`s are **notified by** the service after a successful transition —
  never by `Task` itself, which keeps the model free of notification concerns.
- Queries are all derived from `tasks.values()` — no secondary indexes today, which
  is the honest scaling gap.

---

## 6. Design Patterns (name + why vs alternatives)

- **State machine on the enum — `TaskStatus.canTransitionTo`.** This is the design
  decision worth defending. Three candidate homes for the transition rules:
  - *In the service* (`if (newStatus == DONE && old == TODO) throw`) — rejected: the
    rules get duplicated at every mutation site and drift as callers multiply.
  - *State classes* (one per status, as in `auction` / `vendingmachine`) — rejected
    **here**: those problems have genuinely different *behaviour* per state
    (`ActiveAuctionState` accepts bids, others don't). Task statuses differ only in
    *which transitions are legal* — that's a table, not polymorphism. Five classes
    to express a 5×5 boolean matrix is ceremony.
  - *On the enum* (chosen) — the table is declared once, readable top to bottom, and
    every caller gets it for free.

  Knowing **when State earns its keep and when an enum table is enough** is the
  senior signal here.
- **Observer — `TaskObserver`** on a `CopyOnWriteArrayList`. Notifications
  (email, Slack, audit, burndown) are cross-cutting reactions. COW is the correct
  list: registered once at startup, iterated on every change — write-rare,
  read-heavy, and iteration needs no lock or defensive copy.
- **Facade — `TaskManagement`.**
- *(Considered, not forced)* **Composite** for subtasks and **Strategy** for
  board-ordering rules. Both are right the moment the requirement exists.

---

## 7. Key Implementation Details

### 7.1 There was no state machine at all (the headline)

`setStatus` was a plain assignment:

```java
public void setStatus(TaskStatus status) {
    this.status = status;
    if (status == TaskStatus.DONE) this.completedAt = LocalDateTime.now();
}
```

So every transition was legal, and reopening left a stale timestamp:

```
DONE at 2026-08-02T18:58:49
DONE -> TODO accepted?  status=TODO   completedAt still=2026-08-02T18:58:49
*** no state machine: DONE->TODO allowed, and completedAt is now a lie ***
```

A task sitting in `TODO` that reports a completion time silently corrupts every
cycle-time and throughput report built on top of it — the kind of bug that's found
months later in a dashboard, not in a stack trace.

The fix puts the table on the enum:

```java
static {
    TODO.allowedNext        = EnumSet.of(IN_PROGRESS, BLOCKED);
    IN_PROGRESS.allowedNext = EnumSet.of(IN_REVIEW, DONE, BLOCKED, TODO);
    IN_REVIEW.allowedNext   = EnumSet.of(DONE, IN_PROGRESS, BLOCKED);
    BLOCKED.allowedNext     = EnumSet.of(TODO, IN_PROGRESS);
    DONE.allowedNext        = EnumSet.of(TODO);          // reopen
}
public boolean canTransitionTo(TaskStatus next) { return this == next || allowedNext.contains(next); }
```

and makes the derived field honest:

```java
public synchronized void setStatus(TaskStatus next) {
    if (!this.status.canTransitionTo(next)) {
        throw new IllegalStateException("Illegal transition " + this.status + " -> " + next
                + " (allowed: " + this.status.allowedNext() + ")");
    }
    this.status = next;
    this.completedAt = (next == TaskStatus.DONE) ? LocalDateTime.now() : null;
}
```

Verified:

| Transition | Result |
|---|---|
| `TODO → DONE` | **rejected** — skips the whole workflow |
| `TODO → IN_REVIEW` | **rejected** — nothing to review yet |
| `TODO → IN_PROGRESS` | accepted |
| `TODO → BLOCKED` | accepted |
| `DONE → TODO` | accepted, `completedAt` cleared |

Two details worth calling out. **`this == next` is always allowed**, so a repeated
update is idempotent rather than an error — important for retries and at-least-once
delivery. And the exception message includes `allowedNext()`, so the caller learns
what *was* possible instead of just being told "no".

One thing this exposed: the demo drove `IN_PROGRESS → DONE`, which my first table
forbade. That was **the table being wrong, not the demo** — review is optional in
most real trackers — so I relaxed the rule rather than bending the demo to fit. Worth
mentioning because the instinct to "fix the test" is exactly backwards.

### 7.2 The transition read-then-write wasn't atomic

```java
TaskStatus oldStatus = task.getStatus();   // thread A and B both read TODO
task.setStatus(newStatus);                 // both write
notifyObservers(task, oldStatus, newStatus);
```

Two concurrent transitions both capture the same "old" value, so observers receive
a history that never happened (`TODO → IN_PROGRESS` twice, with the intermediate
state invented). The fix pushes the pair into the entity, under its monitor:

```java
public synchronized TaskStatus transitionTo(TaskStatus next) {
    TaskStatus previous = this.status;
    setStatus(next);
    return previous;
}
```

The service then only notifies when something actually changed:

```java
TaskStatus oldStatus = task.transitionTo(newStatus);
if (oldStatus != newStatus) notifyObservers(task, oldStatus, newStatus);
```

That `if` also suppresses no-op notifications — an idempotent retry shouldn't page
anyone twice.

### 7.3 Tag loss, and silent no-ops

`tags` was a plain `ArrayList` mutated without synchronization. 32 threads × 50 tags:

```
before: 977/1600, 959/1600, 974/1600   (~39% lost)
after : 1600/1600 on every trial
```

`CopyOnWriteArrayList` is right here for the same reason as the observers — tags are
written a handful of times per task and read on every query and render.

Separately, **every** mutator was `if (task != null) { ... }`: updating, assigning,
tagging, or transitioning a nonexistent task did nothing and reported success. Three
mutations against `TASK-9999` all "succeeded". Replaced with one choke point:

```java
private Task requireTask(String taskId) {
    Task task = tasks.get(taskId);
    if (task == null) throw new NoSuchElementException("Task not found: " + taskId);
    return task;
}
```

The general point: **a null-check that silently skips the work is not defensive
programming, it's a swallowed error.** A caller passing a bad id has a bug and
needs to hear about it.

---

## 8. Likely Follow-ups (with concise answers)

- **Subtasks?** Composite: `Task` gets `List<Task> subtasks`, and a parent can't be
  `DONE` while a child isn't. That constraint is a genuinely nice extension to the
  state machine — the transition guard consults children.
- **Task dependencies ("blocked by")?** A DAG of task ids; moving to `IN_PROGRESS`
  requires all blockers `DONE`. Needs cycle detection on link creation (DFS), which
  is the interesting part.
- **All queries are O(n) scans.** `getTasksByStatus`, `byAssignee`, `byPriority`,
  `byTag` each walk every task. Real answer: maintain secondary indexes
  (`Map<TaskStatus, Set<taskId>>`, `Map<assignee, Set<taskId>>`) updated on
  mutation — which is precisely why every mutation should funnel through one method.
  Trade write cost for read cost, since boards are read-dominated.
- **Overdue detection?** Currently computed on demand by scanning. At scale it's a
  `ScheduledExecutorService` sweeping a priority queue ordered by `dueDate`, or a
  DB index on `(due_date, status)`.
- **Audit history?** Append `TaskEvent(taskId, field, old, new, actor, at)` on every
  change. The Observer hook is already the right place; the events also give
  cycle-time analytics for free.
- **Authorization?** `UserRole` exists but is unused. Reporter/assignee/admin rules
  attach at the service methods, same shape as `stackoverflow`'s author checks.
- **Optimistic concurrency for concurrent editors?** Add a `version` field and
  reject a write whose expected version is stale — the standard answer for "two
  people editing the same ticket".
- **How would you test it?** The §7.1 transition table as a parameterized test (one
  case per matrix cell), the reopen-clears-`completedAt` case, N threads tagging one
  task, and an unknown-id case per mutator.

---

## 9. Trade-offs

- **Enum transition table vs State classes:** compact, readable as one block, no
  class explosion — but it can only express *legality*, not per-state *behaviour*.
  The moment a status needs its own logic (auto-assign on `IN_REVIEW`, SLA timer on
  `BLOCKED`), State classes become the better answer. Naming that threshold is the
  point.
- **`synchronized` on `Task` vs immutable tasks:** a lock is simple and keeps the
  status/`completedAt` pair consistent; immutable tasks with copy-on-transition
  would remove locking entirely but churn allocations and break every holder of a
  `Task` reference.
- **`CopyOnWriteArrayList` for tags:** lock-free reads, O(n) copy per add. Right for
  a handful of tags; wrong if tasks accumulated thousands.
- **Reopen allowed (`DONE → TODO`):** matches real trackers, at the cost of `DONE`
  not being terminal — so "completed" queries must always be status-based, never
  "has a `completedAt`".
- **Throwing on unknown ids vs returning `Optional`:** throwing suits mutators
  (a bad id is a caller bug); `getTask` correctly still returns `Optional` because a
  missing task is a legitimate query answer. Different shapes for different
  intents, deliberately.
- **No secondary indexes:** every query is a scan. Correct for the exercise, and §8
  names exactly what production needs.
