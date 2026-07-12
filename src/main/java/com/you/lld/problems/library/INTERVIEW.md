# Library Management — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a library system with catalog vs physical copies, borrow/return/reserve, fines, renewals, and role-based access.

---

## 1. Clarifying Questions

- Catalog vs copy model? (One `Book` per ISBN, many `BookItem` barcoded copies.)
- Reservation queue — FIFO? (Yes, per ISBN.)
- Fine policy? ($1/day overdue; block borrow until paid.)
- Renewal rules? (Allowed if no pending reservation.)
- Member types? (Regular vs premium borrow limits.)
- Concurrency on same copy? (Two clerks must not check out same item.)
- Notifications? (Reservation ready, overdue — pluggable channel.)
- Search scope? (By ISBN, title, author — in-memory maps for demo.)

---

## 2. Functional Requirements

1. **Catalog** — register books (ISBN metadata) and physical copies (`BookItem`).
2. **Borrow** — member borrows available copy; state → Borrowed; record transaction.
3. **Return** — compute fine if overdue; state → Available or fulfill reservation.
4. **Reserve** — queue member per ISBN when no copy available; auto-assign on return.
5. **Renew** — extend due date if no reservation queue.
6. **Fines** — accumulate daily; pay fine to unblock borrows.
7. **Authorization** — librarian vs member operations (role checks in service).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | `synchronized(bookItem)` on borrow/return — per-copy locking |
| **Consistency** | State pattern rejects illegal transitions (can't return Available copy) |
| **Extensibility** | `NotificationService` interface; repository maps swappable for DB |
| **Audit** | `Transaction` log per borrow/return/fine payment |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Book` | model | Catalog entry | ISBN, title, author — no copy state |
| `BookItem` | model | Physical copy | Barcode, `BookItemState`, due date, borrower |
| `AvailableState` / `BorrowedState` / `ReservedState` | model | State objects | `borrow()`, `returnItem()`, `reserve()` per state |
| `Member` | model | Patron | ID, fines, borrow count, account type |
| `Reservation` | model | Hold request | ISBN, member, FIFO queue position |
| `Transaction` | model | Audit record | Type, timestamp, amounts |
| `LibraryService` | service | API | borrow, return, reserve, renew, payFine |
| `LibraryServiceImpl` | impl | Business logic | Maps for books/items/members; reservation queues |
| `NotificationService` | service | Observer contract | onReservationReady, onOverdue |
| `ConsoleNotificationService` | impl | Demo notifier | Prints to stdout |

---

## 5. Relationships

- `Book` (1) → (N) `BookItem` copies sharing ISBN.
- `BookItem` **has-a** `BookItemState` — delegates lifecycle ops.
- `Member` **borrows** `BookItem`; **places** `Reservation` on `Book`.
- `LibraryServiceImpl` **owns** registries and **notifies** `NotificationService` list.
- Return on borrowed copy **may fulfill** head of reservation queue → `ReservedState`.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (`BookItem` + state classes) | vs enum + switch — illegal ops throw inside state, not scattered ifs |
| **Observer** (`NotificationService`) | Decouple alerts from core borrow flow |
| **Repository** (in-memory maps) | Service API stable when swapping persistence |

---

## 7. Key Implementation Details

### 7.1 Per-item locking

```java
synchronized (bookItem) { bookItem.getState().borrow(bookItem, member); }
```

Prevents double checkout when two threads target same barcode.

### 7.2 Reservation fulfillment on return

After return, if reservation queue non-empty for ISBN, assign copy to next member → `ReservedState` instead of `AvailableState`.

### 7.3 Renewal guard

Renewal blocked when reservation queue has waiters — fairness for queued members.

---

## 8. Likely Follow-Up Q&A

**Q: Book vs BookItem?**  
A: ISBN is catalog key; barcode tracks physical asset and state.

**Q: Thread-safe catalog search?**  
A: `ConcurrentHashMap` for indexes; mutations on item still use per-item lock.

**Q: Max books per member?**  
A: Checked in service before borrow; premium `AccountType` raises limit.

**Q: Lost book?**  
A: Mark item lost, charge replacement fee — extension on `BookItemState`.

**Q: Distributed library branches?**  
A: Partition `BookItem` by branchId; reservations scoped to branch inventory.

**Q: Waitlist priority?**  
A: FIFO per ISBN; premium tier could be separate strategy.

**Q: Fine calculation timezone?**  
A: Use library local date for day boundaries; store UTC internally in prod.

**Q: Idempotent return?**  
A: State rejects return from Available — returns error to caller.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| State objects per copy | More classes; vs single enum + validation methods |
| Per-item `synchronized` | Fine-grained; vs global library lock (simple, slow) |
| In-memory FIFO queues | Easy demo; Redis list or DB row locking in prod |
| Block borrow on unpaid fines | Strong policy; vs soft reminders only |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.library.LibraryDemo"`
