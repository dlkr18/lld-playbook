# Meeting Room / Calendar Scheduler — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

---

## 1. Clarifying Questions (first 5 minutes)

Before designing, I'd pin down scope:

1. **Single building or global?** In-process, single-node for this exercise;
   I'll note how it extends to distributed at the end.
2. **Overlap semantics?** Half-open `[start, end)` — a 10:00 end must not block a
   10:00 start (back-to-back meetings). Confirmed.
3. **Attendee conflicts too, or just rooms?** Primary invariant is *no room
   double-booking*. Per-attendee conflict detection is a natural extension
   (same TreeMap keyed per attendee) — I'll mention it as a follow-up.
4. **Capacity meaning?** A booking's headcount must not exceed room capacity.
5. **Recurring meetings?** Yes, daily/weekly expansion into concrete
   occurrences; all-or-nothing on conflict.
6. **Concurrency?** Yes — multiple clients booking simultaneously; the system
   must never grant two overlapping bookings for one room.
7. **Persistence / notifications?** Out of scope for storage (in-memory), but I
   want the notification hook decoupled so it can later push to email/Slack.

---

## 2. Functional Requirements

- Register a room (`id`, `capacity`, `location`).
- Book a room for a half-open interval `[start, end)` for a set of attendees.
- Detect conflicts via **interval overlap** and reject double-booking.
- Cancel a booking (frees the slot).
- Find all rooms free for an interval with at least a minimum capacity.
- Suggest the earliest available slot of a given duration within a window.
- List a room's schedule for a day.
- **Stretch:** recurring meetings (daily/weekly) expanded into concrete bookings.

## 3. Non-Functional Requirements

- **Correctness of the overlap invariant** above everything.
- **Thread-safety:** two threads must not both succeed booking the same room on
  overlapping intervals.
- **Efficiency:** overlap detection better than `O(n)` per room →
  `O(log n)` via an ordered map.
- **Extensibility:** allocation policy and notification channel swappable without
  touching core logic (OCP).
- **Clarity:** immutable value objects; concurrency reasoning localized.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `TimeInterval` | model (VO) | Immutable half-open `[start,end)`. Validates `start < end`. `overlaps()` = `s1<e2 && s2<e1`. The single source of overlap truth. |
| `Room` | model (entity) | Immutable `id` (identity), `capacity`, `location`. `equals/hashCode` on id. |
| `Attendee` | model (VO) | Immutable `id/name/email`. Deliberately logic-free — notification lives in the observer, not here (SRP). |
| `Booking` | model (entity) | Immutable snapshot: id, room, interval, organizer, attendees (unmodifiable, includes organizer), title, `BookingStatus`. `cancelled()` returns a new CANCELLED copy — no mutable field to publish under concurrency. |
| `BookingStatus` | model (enum) | `CONFIRMED → CANCELLED` (terminal). |
| `BookingRequest` | model (VO / command) | Bundles booking params; `roomId` nullable (null ⇒ let strategy choose). `withInterval()` supports recurrence expansion. |
| `RoomSlot` | model (VO) | `(Room, TimeInterval)` — the unit an allocation strategy chooses between. |
| `RecurrenceRule` / `Frequency` | model | `frequency × occurrences`; `Frequency` knows its `ChronoUnit` + step for declarative expansion. |
| `RoomCalendar` | service (interface) | Per-room ordered set of bookings: `isFree`, `book`, `cancel`, `scheduleFor(day)`, `earliestFreeSlot`. |
| `TreeMapRoomCalendar` | service/impl | `TreeMap<start, Booking>`; `O(log n)` overlap via floor/ceiling. Not internally synchronized (see locking). |
| `AllocationStrategy` | service (interface) | `select(List<RoomSlot>)` — which candidate to use. |
| `FirstFitAllocation` / `SmallestSufficientCapacityAllocation` | service/impl | First-fit vs best-fit-by-capacity. |
| `BookingObserver` / `AttendeeNotifier` | service + impl | React to book/cancel; notifier "emails" each attendee. |
| `MeetingScheduler` | root | Facade: registry, per-room calendars, per-room locks, strategy, observers. |

---

## 5. Relationships

- `MeetingScheduler` **owns** one `RoomCalendar` and one `ReentrantLock` per
  registered `Room`, plus a `bookingsById` index for O(1) cancel/lookup.
- `MeetingScheduler` **has-a** (composition) `AllocationStrategy` (hot-swappable,
  `volatile`) and a list of `BookingObserver`s (`CopyOnWriteArrayList`).
- `Booking` **references** a `Room` and a `TimeInterval`; **contains** a set of
  `Attendee`s.
- `RoomCalendar` is keyed on `TimeInterval.getStart()`; the interval's `overlaps`
  logic is reused for day-schedule filtering and slot search.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `AllocationStrategy`.** "Which room" is a policy that changes
  (first-fit, smallest-sufficient, cost-based, nearest-to-requester). Encapsulating
  it keeps `MeetingScheduler` closed for modification. *Alternative:* an `if/else`
  on an enum inside the scheduler — rejected: violates OCP, untestable in
  isolation.
- **Observer — `BookingObserver`.** Notifications (attendees, audit log, calendar
  sync) are cross-cutting reactions to lifecycle events. Keeping them out of
  `Booking`/`MeetingScheduler` honours SRP and lets us add channels without
  editing the booking path. *Alternative:* call an `EmailService` directly in
  `book()` — rejected: couples core booking to delivery, hard to extend/test.
- **Facade — `MeetingScheduler`.** Presents one coherent API over registry,
  calendars, locks, strategy, observers. It's the "god object" an interviewer
  reads first, but it *delegates* — no business logic leaks into it beyond
  orchestration + locking.
- **Command / Value Object — `BookingRequest`.** Bundles parameters so signatures
  stay small and a request can be retargeted (`withInterval`) during recurrence
  expansion.
- *(Considered, not forced)* **Factory** for calendars — trivial here (`new
  TreeMapRoomCalendar()`), so I inlined it rather than add ceremony.

---

## 7. Key Implementation Details

### 7.1 O(log n) overlap detection (the crux)

Bookings in a room are non-overlapping and stored in a
`TreeMap<LocalDateTime, Booking>` keyed by start. For a candidate `[s, e)` at
most two existing intervals can collide:

```java
Map.Entry<LocalDateTime, Booking> floor = bookingsByStart.floorEntry(s);
if (floor != null && floor.getValue().getInterval().getEnd().isAfter(s)) return false;

Map.Entry<LocalDateTime, Booking> ceiling = bookingsByStart.ceilingEntry(s);
if (ceiling != null && ceiling.getValue().getInterval().getStart().isBefore(e)) return false;
return true;
```

- `floorEntry(s)` = the meeting with the greatest start `<= s`; it collides iff
  it **runs past** `s` (`end > s`).
- `ceilingEntry(s)` = the meeting with the least start `>= s`; it collides iff it
  **begins before** `e` (`start < e`).

Both navigations are `O(log n)`. This is the classic "My Calendar I" insight.
Half-open semantics make the boundary case (`end == s`) correctly *non*-conflicting.

### 7.2 The locking that makes booking atomic

The dangerous window is *check-free → insert*: two threads both see the slot free,
both insert. I guard it with a **per-room `ReentrantLock`**:

```java
ReentrantLock lock = roomLocks.get(room.getId());
lock.lock();
try {
    calendars.get(room.getId()).book(booking); // isFree() + put() together
    bookingsById.put(booking.getId(), booking);
} finally {
    lock.unlock();
}
notifyBooked(booking); // AFTER commit, OUTSIDE the lock
```

- The lock is **per room** (a `ConcurrentHashMap<roomId, ReentrantLock>`), so
  bookings in different rooms never contend — full parallelism where it's safe.
- The calendar itself is deliberately **not** internally synchronized; all access
  to a given room's calendar goes through its lock. This concentrates the
  concurrency reasoning in one place instead of scattering it.
- Observers fire outside the lock so a slow/faulty notifier can't widen the
  critical section or deadlock.
- Verified by a **64-thread race** test: exactly one `book()` returns, 63 throw
  `BookingConflictException`, and the calendar holds one booking.

### 7.3 Earliest-slot search + recurrence

- `earliestFreeSlot(window, duration)` sweeps a cursor from `window.start`,
  jumping over each booking that intersects the window (found via `lowerEntry` +
  `subMap`), and returns the first gap `>= duration`. `O(log n + k)`.
- `bookRecurring` expands the rule into concrete occurrences, then under a
  **single** hold of the room lock verifies *every* occurrence is free before
  inserting *any* — all-or-nothing, so a series never lands half-booked.

---

## 8. Likely Follow-ups (with concise answers)

- **Per-attendee conflicts (person double-booked)?** Add a
  `Map<attendeeId, TreeMap<start, Booking>>` and, inside the same locked section,
  check each attendee's calendar. To avoid deadlock when locking a room + N
  attendees, acquire locks in a **global order** (e.g. sorted by key) or use a
  single ordered lock list.
- **Distributed / multi-node?** The per-room `ReentrantLock` becomes a
  distributed lock (Redis `SET NX PX` + fencing token, or a DB unique constraint
  on `(room_id, time_bucket)`); the atomic check-insert becomes a conditional
  write / transaction. Overlap check can be a range query with `SELECT … FOR
  UPDATE`.
- **Time zones / DST?** Store instants in UTC (`Instant`/`OffsetDateTime`); render
  in the room's zone. Recurrence should expand in the room's local zone so a
  weekly 9am survives DST.
- **Very long horizons for recurrence?** Don't materialize infinitely — store the
  rule and expand lazily for the queried window, or cap occurrences (as here).
- **Reads dominating writes?** Swap the `ReentrantLock` for a
  `ReadWriteLock` so `isFree`/`schedule` reads run concurrently and only
  `book`/`cancel` take the write lock.
- **Waitlist / auto-suggest on conflict?** On `BookingConflictException`, call
  `suggestSlot` and return the next free `(room, slot)` — the pieces already
  compose.
- **Buffer/setup time between meetings?** Expand each stored interval by the
  buffer, or check `[start - buffer, end + buffer)` in `isFree`.

---

## 9. Trade-offs

- **In-memory `TreeMap` vs DB:** great for the exercise and `O(log n)`; not
  durable. Production needs persistence + the distributed locking above.
- **Per-room `ReentrantLock` vs a single global lock:** more locks/memory, but
  cross-room parallelism. Chosen because rooms are the natural sharding key.
- **Immutable `Booking` (copy on cancel) vs mutable status field:** more
  allocation, but zero visibility bugs and safe sharing across threads — worth it.
- **Calendar not internally thread-safe:** relies on the orchestrator holding the
  lock — a documented invariant, not defensive. Trade simplicity/speed for a
  contract the caller must honour (stated explicitly in Javadoc).
- **All-or-nothing recurrence vs best-effort:** simpler mental model and no
  partial series, at the cost of failing the whole series on one clash (could
  offer a `skipConflicts` mode as a variant).
- **Strategy chosen at scheduler scope (volatile field):** simple; if different
  callers need different policies simultaneously, pass the strategy per-call
  instead.
