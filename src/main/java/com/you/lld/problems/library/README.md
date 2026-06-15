# Library Management — LLD

Design a library: catalog vs physical copies, borrow/return/reserve, fines, renewals, role-based access.

## Package Structure

```
library/
  model/       Book, BookItem, Member, Reservation, State objects
  api/         LibraryService, NotificationService
  impl/        LibraryServiceImpl, ConsoleNotificationService
  exceptions/  domain-specific errors
  LibraryDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **State** | `BookItem` + Available/Borrowed/Reserved | Illegal transitions rejected by state objects. |
| **Observer** | `NotificationService` list | Decouple reservation-ready / overdue alerts. |
| **Repository** | In-memory maps for books, members, items | Swap for DB without changing service API. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.library.LibraryDemo"
```

## Key Talking Points

- **Book vs BookItem** — ISBN catalog entry vs barcoded physical copy; reservations queue per ISBN.
- **Per-item locking** — `synchronized(bookItem)` on borrow/return prevents double checkout.
- **FIFO reservations** — fulfilled automatically on return; blocks renewal if queue non-empty.
- **Fines** — $1/day overdue; block new borrows until paid.
