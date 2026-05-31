# library - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/library/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py library`.

## Project Structure (27 files)

```
library/
├── LibraryDemo.java
├── api/LibraryService.java
├── api/NotificationService.java
├── model/AccountType.java
├── model/AvailableState.java
├── model/Book.java
├── model/BookItem.java
├── model/BookItemState.java
├── model/BookStatus.java
├── model/BorrowedState.java
├── model/Member.java
├── model/Rack.java
├── model/Reservation.java
├── model/ReservationStatus.java
├── model/ReservedState.java
├── model/Subject.java
├── model/Transaction.java
├── model/TransactionType.java
├── impl/ConsoleNotificationService.java
├── impl/LibraryServiceImpl.java
├── exceptions/BookNotAvailableException.java
├── exceptions/BookNotFoundException.java
├── exceptions/MaxBorrowLimitException.java
├── exceptions/MemberNotFoundException.java
├── exceptions/OutstandingFineException.java
├── exceptions/ReservationNotFoundException.java
├── exceptions/UnauthorizedException.java
```

## Source Code

### `LibraryDemo.java`

<details>
<summary>Click to view LibraryDemo.java</summary>

```java
package com.you.lld.problems.library;

import com.you.lld.problems.library.impl.LibraryServiceImpl;
import com.you.lld.problems.library.impl.ConsoleNotificationService;
import com.you.lld.problems.library.exceptions.UnauthorizedException;
import com.you.lld.problems.library.model.*;

import java.util.List;

/**
 * Demonstrates the full Library Management System:
 *   1. Role-based access (librarian vs member)
 *   2. Catalog + multiple copies per ISBN
 *   3. Borrow / return / search
 *   4. Reservation queue
 *   5. Overdue fines + payment
 *   6. Renewals
 */
public class LibraryDemo {

    public static void main(String[] args) {
        System.out.println("=== Library Management System (SDE3) ===\n");

        LibraryServiceImpl service = new LibraryServiceImpl();
        service.addNotifier(new ConsoleNotificationService());

        // ---------- 1. Role-based access ----------
        System.out.println("--- 1. Roles: Librarian vs Member ---");

        // Bootstrap: first librarian (registerLibrarian doesn't need auth)
        String librarianId = service.registerLibrarian("Ms. Parker", "parker@lib.com");
        System.out.println("Librarian: " + service.getMember(librarianId));

        // Librarian registers members
        String alice = service.registerMember(librarianId, "Alice", "alice@lib.com");
        String bob   = service.registerMember(librarianId, "Bob", "bob@lib.com");
        System.out.println("Alice: " + service.getMember(alice));
        System.out.println("Bob:   " + service.getMember(bob));

        // Member tries to register another member -> DENIED
        try {
            service.registerMember(alice, "Mallory", "mallory@lib.com");
        } catch (UnauthorizedException e) {
            System.out.println("Alice tried registerMember -> DENIED: " + e.getMessage());
        }

        // Duplicate email check still works
        try {
            service.registerMember(librarianId, "Alice2", "alice@lib.com");
        } catch (IllegalArgumentException e) {
            System.out.println("Duplicate email blocked: " + e.getMessage());
        }

        // ---------- 2. Catalog (librarian-only) ----------
        System.out.println("\n--- 2. Catalog management (librarian-only) ---");

        service.addBook(librarianId, new Book("978-0-201-63361-0", "Design Patterns",
                "Gang of Four", "Addison-Wesley", 1994, Subject.COMPUTER_SCIENCE));
        service.addBook(librarianId, new Book("978-0-13-235088-4", "Clean Code",
                "Robert C. Martin", "Prentice Hall", 2008, Subject.ENGINEERING));
        System.out.println("Librarian added 2 books to catalog");

        // Member tries to add a book -> DENIED
        try {
            service.addBook(alice, new Book("978-0-00-000000-0", "Hacking",
                    "Hacker", "Underground", 2025, Subject.OTHER));
        } catch (UnauthorizedException e) {
            System.out.println("Alice tried addBook -> DENIED: " + e.getMessage());
        }

        // Add physical copies
        Rack csRack = new Rack("R-A1", 1, "Computer Science");
        Rack engRack = new Rack("R-B2", 2, "Engineering");

        String dp1 = service.addBookItem(librarianId, "978-0-201-63361-0", csRack);
        String dp2 = service.addBookItem(librarianId, "978-0-201-63361-0", csRack);
        String cc1 = service.addBookItem(librarianId, "978-0-13-235088-4", engRack);
        System.out.println("Design Patterns copies: " + dp1 + ", " + dp2);
        System.out.println("Clean Code copy: " + cc1);

        // ---------- 3. Search (any role) ----------
        System.out.println("\n--- 3. Search (any role) ---");
        List<Book> found = service.searchByTitle("Design");
        System.out.println("Title 'Design': " + found.size() + " -> " + found.get(0));
        List<BookItem> available = service.getAvailableCopies("978-0-201-63361-0");
        System.out.println("Available copies of Design Patterns: " + available.size());

        // ---------- 4. Borrow (member-only) ----------
        System.out.println("\n--- 4. Borrow (member-only) ---");
        service.borrowBook(alice, dp1);
        System.out.println("Alice borrowed " + dp1);
        service.borrowBook(bob, dp2);
        System.out.println("Bob borrowed " + dp2);

        available = service.getAvailableCopies("978-0-201-63361-0");
        System.out.println("Available copies after borrows: " + available.size());

        // Librarian tries to borrow -> DENIED
        try {
            service.borrowBook(librarianId, cc1);
        } catch (UnauthorizedException e) {
            System.out.println("Librarian tried borrowBook -> DENIED: " + e.getMessage());
        }

        // ---------- 5. Reservation ----------
        System.out.println("\n--- 5. Reservation (all copies out) ---");
        String charlieId = service.registerMember(librarianId, "Charlie", "charlie@lib.com");
        String resId = service.reserveBook(charlieId, "978-0-201-63361-0");
        System.out.println("Charlie reserved: " + resId);

        // ---------- 6. Return triggers reservation ----------
        System.out.println("\n--- 6. Return triggers reservation fulfillment ---");
        double fine = service.returnBook(alice, dp1);
        System.out.println("Alice returned " + dp1 + ", fine: $" + String.format("%.2f", fine));

        // Charlie picks up reserved copy
        service.borrowBook(charlieId, dp1);
        System.out.println("Charlie picked up reserved copy " + dp1);

        // ---------- 7. Renewal ----------
        System.out.println("\n--- 7. Renewal ---");
        service.renewBook(bob, dp2);
        System.out.println("Bob renewed " + dp2 + " (1/" + BookItem.MAX_RENEWALS + ")");
        service.renewBook(bob, dp2);
        System.out.println("Bob renewed " + dp2 + " (2/" + BookItem.MAX_RENEWALS + ")");
        try {
            service.renewBook(bob, dp2);
        } catch (IllegalStateException e) {
            System.out.println("Third renewal blocked: " + e.getMessage());
        }

        // ---------- 8. Overdue fine ----------
        System.out.println("\n--- 8. Overdue fine ---");
        service.borrowBook(alice, cc1);
        System.out.println("Alice borrowed Clean Code (" + cc1 + ")");
        simulateOverdue(service, cc1, 5);

        fine = service.returnBook(alice, cc1);
        System.out.println("Alice returned overdue, fine: $" + String.format("%.2f", fine));
        System.out.println("Outstanding: $" + String.format("%.2f", service.getOutstandingFines(alice)));

        // Can't borrow with unpaid fines
        try {
            service.borrowBook(alice, cc1);
        } catch (Exception e) {
            System.out.println("Borrow blocked: " + e.getMessage());
        }

        // ---------- 9. Pay fine ----------
        System.out.println("\n--- 9. Pay fine ---");
        service.payFine(alice, fine);
        service.borrowBook(alice, cc1);
        System.out.println("Alice paid fine and borrowed again");

        // ---------- 10. History ----------
        System.out.println("\n--- 10. Alice's history ---");
        for (Transaction t : service.getMemberHistory(alice)) {
            System.out.println("  " + t);
        }

        System.out.println("\n=== Demo complete ===");
    }

    private static void simulateOverdue(LibraryServiceImpl service, String barcode, int daysOverdue) {
        try {
            java.lang.reflect.Field itemsField = LibraryServiceImpl.class.getDeclaredField("bookItems");
            itemsField.setAccessible(true);
            @SuppressWarnings("unchecked")
            java.util.Map<String, BookItem> items =
                    (java.util.Map<String, BookItem>) itemsField.get(service);
            BookItem item = items.get(barcode);
            if (item != null) {
                java.lang.reflect.Field dueDateField = BookItem.class.getDeclaredField("dueDate");
                dueDateField.setAccessible(true);
                dueDateField.set(item, java.time.LocalDate.now().minusDays(daysOverdue));
            }
        } catch (Exception e) {
            System.out.println("(Could not simulate overdue: " + e.getMessage() + ")");
        }
    }
}
```

</details>

### `api/LibraryService.java`

<details>
<summary>Click to view api/LibraryService.java</summary>

```java
package com.you.lld.problems.library.api;

import com.you.lld.problems.library.model.*;
import java.util.List;

/**
 * Core library operations with role-based access:
 *
 *   LIBRARIAN-only: addBook, addBookItem, registerMember
 *   MEMBER-only:    borrowBook, returnBook, renewBook, reserveBook
 *   ANY role:       search, getAvailableCopies, getMemberHistory, fines
 */
public interface LibraryService {

    // --- Catalog (LIBRARIAN only) ---
    void addBook(String accountId, Book book);
    String addBookItem(String accountId, String isbn, Rack rack);
    Book getBook(String isbn);

    // --- Members (LIBRARIAN registers, anyone can view self) ---
    String registerMember(String accountId, String name, String email);
    String registerLibrarian(String name, String email);
    Member getMember(String memberId);

    // --- Core lifecycle (MEMBER only) ---
    void borrowBook(String memberId, String barcode);
    double returnBook(String memberId, String barcode);
    void renewBook(String memberId, String barcode);

    // --- Reservations (MEMBER only) ---
    String reserveBook(String memberId, String isbn);
    void cancelReservation(String reservationId);

    // --- Search (ANY) ---
    List<Book> searchByTitle(String keyword);
    List<Book> searchByAuthor(String keyword);
    Book searchByIsbn(String isbn);
    List<BookItem> getAvailableCopies(String isbn);

    // --- Fines (ANY for own account) ---
    double getOutstandingFines(String memberId);
    void payFine(String memberId, double amount);

    // --- History (ANY for own account) ---
    List<Transaction> getMemberHistory(String memberId);
}
```

</details>

### `api/NotificationService.java`

<details>
<summary>Click to view api/NotificationService.java</summary>

```java
package com.you.lld.problems.library.api;

/**
 * Observer interface for library events (reservation available, fine charged, etc.).
 * Implementations can send email, SMS, push notifications, or just log to console.
 */
public interface NotificationService {
    void notify(String memberId, String message);
}
```

</details>

### `model/AccountType.java`

<details>
<summary>Click to view model/AccountType.java</summary>

```java
package com.you.lld.problems.library.model;

public enum AccountType {
    LIBRARIAN,
    MEMBER
}
```

</details>

### `model/AvailableState.java`

<details>
<summary>Click to view model/AvailableState.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Book copy is on the shelf, ready to be borrowed or reserved.
 * Valid transitions: checkout -> Borrowed, reserve -> Reserved.
 */
public class AvailableState implements BookItemState {

    public static final AvailableState INSTANCE = new AvailableState();

    private AvailableState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        item.setBorrowedByInternal(memberId);
        item.setDueDateInternal(LocalDate.now().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(0);
        return BorrowedState.INSTANCE;
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        throw new IllegalStateException("Cannot return -- item " + item.getBarcode() + " is not borrowed");
    }

    @Override
    public boolean renew(BookItem item) {
        throw new IllegalStateException("Cannot renew -- item " + item.getBarcode() + " is not borrowed");
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        item.setBorrowedByInternal(memberId); // tracks who it's reserved for
        return ReservedState.INSTANCE;
    }

    @Override
    public boolean isAvailable() { return true; }

    @Override
    public BookStatus getStatus() { return BookStatus.AVAILABLE; }

    @Override
    public String toString() { return "AVAILABLE"; }
}
```

</details>

### `model/Book.java`

<details>
<summary>Click to view model/Book.java</summary>

```java
package com.you.lld.problems.library.model;

import java.util.Objects;

/**
 * Catalog entry -- represents a title (not a physical copy).
 * One Book can have many BookItems (physical copies).
 * Immutable after construction.
 */
public class Book {
    private final String isbn;
    private final String title;
    private final String author;
    private final String publisher;
    private final int publicationYear;
    private final Subject subject;

    public Book(String isbn, String title, String author,
                String publisher, int publicationYear, Subject subject) {
        this.isbn = Objects.requireNonNull(isbn, "ISBN is required");
        this.title = Objects.requireNonNull(title, "Title is required");
        this.author = Objects.requireNonNull(author, "Author is required");
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.subject = subject != null ? subject : Subject.OTHER;
    }

    public Book(String isbn, String title, String author, String publisher, int year) {
        this(isbn, title, author, publisher, year, Subject.OTHER);
    }

    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getPublisher() { return publisher; }
    public int getPublicationYear() { return publicationYear; }
    public Subject getSubject() { return subject; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book)) return false;
        return isbn.equals(((Book) o).isbn);
    }

    @Override
    public int hashCode() { return isbn.hashCode(); }

    @Override
    public String toString() {
        return title + " by " + author + " (" + publicationYear + ") [" + isbn + "]";
    }
}
```

</details>

### `model/BookItem.java`

<details>
<summary>Click to view model/BookItem.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Physical copy of a Book. Each BookItem has a unique barcode.
 *
 * Uses the State pattern for lifecycle transitions:
 *   Available  --checkout-->  Borrowed
 *   Available  --reserve-->   Reserved
 *   Borrowed   --return-->    Available
 *   Borrowed   --renew-->     Borrowed (extended due date)
 *   Reserved   --checkout-->  Borrowed (reserved member only)
 *
 * Invalid transitions throw IllegalStateException from the state objects.
 * Thread safety: mutations happen under synchronized(this) in the service layer.
 */
public class BookItem {
    private final String barcode;
    private final String isbn;
    private final Rack rack;

    private BookItemState state;
    private String borrowedBy;
    private LocalDate dueDate;
    private int renewalCount;

    public static final int LOAN_PERIOD_DAYS = 14;
    public static final int MAX_RENEWALS = 2;

    public BookItem(String barcode, String isbn, Rack rack) {
        this.barcode = barcode;
        this.isbn = isbn;
        this.rack = rack;
        this.state = AvailableState.INSTANCE;
        this.renewalCount = 0;
    }

    // --- State-delegated operations ---

    public void checkout(String memberId) {
        this.state = state.checkout(this, memberId);
    }

    public void returnItem() {
        this.state = state.returnItem(this);
    }

    public boolean renew() {
        return state.renew(this);
    }

    public void reserve(String memberId) {
        this.state = state.reserve(this, memberId);
    }

    // --- Queries (delegated to state) ---

    public boolean isAvailable() { return state.isAvailable(); }

    public BookStatus getStatus() { return state.getStatus(); }

    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate);
    }

    // --- Package-private setters for state objects ---

    void setBorrowedByInternal(String memberId) { this.borrowedBy = memberId; }
    void setDueDateInternal(LocalDate dueDate) { this.dueDate = dueDate; }
    void setRenewalCountInternal(int count) { this.renewalCount = count; }

    // --- Public getters ---

    public String getBarcode() { return barcode; }
    public String getIsbn() { return isbn; }
    public Rack getRack() { return rack; }
    public String getBorrowedBy() { return borrowedBy; }
    public LocalDate getDueDate() { return dueDate; }
    public int getRenewalCount() { return renewalCount; }

    @Override
    public String toString() {
        return "BookItem[" + barcode + ", isbn=" + isbn + ", state=" + state
                + (borrowedBy != null ? ", borrowedBy=" + borrowedBy : "")
                + (dueDate != null ? ", due=" + dueDate : "") + "]";
    }
}
```

</details>

### `model/BookItemState.java`

<details>
<summary>Click to view model/BookItemState.java</summary>

```java
package com.you.lld.problems.library.model;

/**
 * State pattern for BookItem lifecycle.
 *
 * Each state defines which transitions are legal:
 *   AvailableState  -> checkout -> BorrowedState
 *   AvailableState  -> reserve  -> ReservedState
 *   BorrowedState   -> return   -> AvailableState
 *   BorrowedState   -> renew    -> BorrowedState (with extended due date)
 *   ReservedState   -> checkout -> BorrowedState (only by the reserved member)
 *
 * Invalid transitions throw IllegalStateException with a clear message.
 * Implementations are stateless singletons -- all mutable data lives on BookItem.
 */
public interface BookItemState {

    /** Attempt to check out this item to a member. Returns the next state. */
    BookItemState checkout(BookItem item, String memberId);

    /** Attempt to return this item. Returns the next state. */
    BookItemState returnItem(BookItem item);

    /** Attempt to renew this item. Returns true if renewed, throws if not possible. */
    boolean renew(BookItem item);

    /** Attempt to reserve this item for a member. Returns the next state. */
    BookItemState reserve(BookItem item, String memberId);

    boolean isAvailable();

    BookStatus getStatus();
}
```

</details>

### `model/BookStatus.java`

<details>
<summary>Click to view model/BookStatus.java</summary>

```java
package com.you.lld.problems.library.model;

public enum BookStatus {
    AVAILABLE,
    BORROWED,
    RESERVED,  // held for a member who placed a reservation
    LOST,
    MAINTENANCE
}
```

</details>

### `model/BorrowedState.java`

<details>
<summary>Click to view model/BorrowedState.java</summary>

```java
package com.you.lld.problems.library.model;

/**
 * Book copy is currently checked out by a member.
 * Valid transitions: returnItem -> Available, renew -> Borrowed (extended due date).
 */
public class BorrowedState implements BookItemState {

    public static final BorrowedState INSTANCE = new BorrowedState();

    private BorrowedState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Cannot checkout -- item " + item.getBarcode()
                        + " is already borrowed by " + item.getBorrowedBy());
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        item.setBorrowedByInternal(null);
        item.setDueDateInternal(null);
        item.setRenewalCountInternal(0);
        return AvailableState.INSTANCE;
    }

    @Override
    public boolean renew(BookItem item) {
        if (item.getRenewalCount() >= BookItem.MAX_RENEWALS) {
            throw new IllegalStateException(
                    "Max renewals (" + BookItem.MAX_RENEWALS + ") reached for " + item.getBarcode());
        }
        item.setDueDateInternal(item.getDueDate().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(item.getRenewalCount() + 1);
        return true;
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Cannot reserve -- item " + item.getBarcode() + " is currently borrowed");
    }

    @Override
    public boolean isAvailable() { return false; }

    @Override
    public BookStatus getStatus() { return BookStatus.BORROWED; }

    @Override
    public String toString() { return "BORROWED"; }
}
```

</details>

### `model/Member.java`

<details>
<summary>Click to view model/Member.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDate;
import java.util.*;

/**
 * Library account -- can be a LIBRARIAN (admin) or MEMBER (borrower).
 * Tracks borrowed item barcodes (not ISBNs) and outstanding fines.
 */
public class Member {
    private final String id;
    private final String name;
    private final String email;
    private final AccountType accountType;
    private final LocalDate memberSince;
    private final Set<String> borrowedBarcodes; // barcode set
    private final int maxBooksAllowed;
    private double totalFinesOwed;

    public static final int DEFAULT_MAX_BOOKS = 5;

    public Member(String id, String name, String email) {
        this(id, name, email, AccountType.MEMBER, DEFAULT_MAX_BOOKS);
    }

    public Member(String id, String name, String email, AccountType accountType) {
        this(id, name, email, accountType, DEFAULT_MAX_BOOKS);
    }

    public Member(String id, String name, String email, AccountType accountType, int maxBooks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.accountType = accountType;
        this.memberSince = LocalDate.now();
        this.borrowedBarcodes = new HashSet<>();
        this.maxBooksAllowed = maxBooks;
        this.totalFinesOwed = 0.0;
    }

    public boolean canBorrow() {
        return borrowedBarcodes.size() < maxBooksAllowed && totalFinesOwed == 0.0;
    }

    public void addBorrowedItem(String barcode) { borrowedBarcodes.add(barcode); }
    public void removeBorrowedItem(String barcode) { borrowedBarcodes.remove(barcode); }
    public boolean hasBorrowed(String barcode) { return borrowedBarcodes.contains(barcode); }

    public void chargeFine(double amount) { this.totalFinesOwed += amount; }
    public void payFine(double amount) {
        this.totalFinesOwed = Math.max(0, this.totalFinesOwed - amount);
    }

    public boolean isLibrarian() { return accountType == AccountType.LIBRARIAN; }
    public boolean isMember() { return accountType == AccountType.MEMBER; }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public AccountType getAccountType() { return accountType; }
    public LocalDate getMemberSince() { return memberSince; }
    public Set<String> getBorrowedBarcodes() { return Collections.unmodifiableSet(borrowedBarcodes); }
    public int getBorrowedCount() { return borrowedBarcodes.size(); }
    public int getMaxBooksAllowed() { return maxBooksAllowed; }
    public double getTotalFinesOwed() { return totalFinesOwed; }

    @Override
    public String toString() {
        return name + " [" + accountType + "] (ID: " + id + ") - borrowed: "
                + borrowedBarcodes.size() + "/" + maxBooksAllowed
                + (totalFinesOwed > 0 ? ", fines: $" + String.format("%.2f", totalFinesOwed) : "");
    }
}
```

</details>

### `model/Rack.java`

<details>
<summary>Click to view model/Rack.java</summary>

```java
package com.you.lld.problems.library.model;

/**
 * Physical shelf location in the library.
 */
public class Rack {
    private final String id;
    private final int floor;
    private final String section;

    public Rack(String id, int floor, String section) {
        this.id = id;
        this.floor = floor;
        this.section = section;
    }

    public String getId() { return id; }
    public int getFloor() { return floor; }
    public String getSection() { return section; }

    @Override
    public String toString() {
        return "Rack[" + id + ", floor=" + floor + ", section=" + section + "]";
    }
}
```

</details>

### `model/Reservation.java`

<details>
<summary>Click to view model/Reservation.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDateTime;

/**
 * A member's request to borrow a book when all copies are currently unavailable.
 * Reservations are queued per ISBN and fulfilled FIFO on return.
 */
public class Reservation {
    private final String id;
    private final String memberId;
    private final String isbn;
    private final LocalDateTime createdAt;
    private ReservationStatus status;

    public Reservation(String id, String memberId, String isbn) {
        this.id = id;
        this.memberId = memberId;
        this.isbn = isbn;
        this.createdAt = LocalDateTime.now();
        this.status = ReservationStatus.WAITING;
    }

    public String getId() { return id; }
    public String getMemberId() { return memberId; }
    public String getIsbn() { return isbn; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    @Override
    public String toString() {
        return "Reservation[" + id + ", member=" + memberId
                + ", isbn=" + isbn + ", status=" + status + "]";
    }
}
```

</details>

### `model/ReservationStatus.java`

<details>
<summary>Click to view model/ReservationStatus.java</summary>

```java
package com.you.lld.problems.library.model;

public enum ReservationStatus {
    WAITING,     // in queue, no copy available yet
    FULFILLED,   // a copy became available, member was notified
    CANCELLED,   // member cancelled the reservation
    EXPIRED      // member didn't pick up within the grace period
}
```

</details>

### `model/ReservedState.java`

<details>
<summary>Click to view model/ReservedState.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Book copy is held for a specific member who placed a reservation.
 * Valid transitions: checkout -> Borrowed (only by the reserved member).
 */
public class ReservedState implements BookItemState {

    public static final ReservedState INSTANCE = new ReservedState();

    private ReservedState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        if (!memberId.equals(item.getBorrowedBy())) {
            throw new IllegalStateException(
                    "Item " + item.getBarcode() + " is reserved for member "
                            + item.getBorrowedBy() + ", not " + memberId);
        }
        // Reserved member is picking up -- transition to Borrowed
        item.setDueDateInternal(LocalDate.now().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(0);
        return BorrowedState.INSTANCE;
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        throw new IllegalStateException(
                "Cannot return -- item " + item.getBarcode() + " is reserved, not borrowed");
    }

    @Override
    public boolean renew(BookItem item) {
        throw new IllegalStateException(
                "Cannot renew -- item " + item.getBarcode() + " is reserved, not borrowed");
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Item " + item.getBarcode() + " is already reserved for member " + item.getBorrowedBy());
    }

    @Override
    public boolean isAvailable() { return false; }

    @Override
    public BookStatus getStatus() { return BookStatus.RESERVED; }

    @Override
    public String toString() { return "RESERVED"; }
}
```

</details>

### `model/Subject.java`

<details>
<summary>Click to view model/Subject.java</summary>

```java
package com.you.lld.problems.library.model;

public enum Subject {
    FICTION,
    SCIENCE,
    ENGINEERING,
    HISTORY,
    PHILOSOPHY,
    BUSINESS,
    COMPUTER_SCIENCE,
    OTHER
}
```

</details>

### `model/Transaction.java`

<details>
<summary>Click to view model/Transaction.java</summary>

```java
package com.you.lld.problems.library.model;

import java.time.LocalDateTime;

/**
 * Immutable audit record of a library operation.
 */
public class Transaction {
    private final String id;
    private final String memberId;
    private final String barcode;
    private final TransactionType type;
    private final LocalDateTime timestamp;
    private final double fineAmount; // non-zero only for RETURN with overdue

    public Transaction(String id, String memberId, String barcode, TransactionType type) {
        this(id, memberId, barcode, type, 0.0);
    }

    public Transaction(String id, String memberId, String barcode,
                       TransactionType type, double fineAmount) {
        this.id = id;
        this.memberId = memberId;
        this.barcode = barcode;
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.fineAmount = fineAmount;
    }

    public String getId() { return id; }
    public String getMemberId() { return memberId; }
    public String getBarcode() { return barcode; }
    public TransactionType getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public double getFineAmount() { return fineAmount; }

    @Override
    public String toString() {
        String s = type + " [" + barcode + "] by member " + memberId + " at " + timestamp;
        if (fineAmount > 0) s += " (fine: $" + String.format("%.2f", fineAmount) + ")";
        return s;
    }
}
```

</details>

### `model/TransactionType.java`

<details>
<summary>Click to view model/TransactionType.java</summary>

```java
package com.you.lld.problems.library.model;

public enum TransactionType {
    BORROW,
    RETURN,
    RENEW,
    RESERVE
}
```

</details>

### `impl/ConsoleNotificationService.java`

<details>
<summary>Click to view impl/ConsoleNotificationService.java</summary>

```java
package com.you.lld.problems.library.impl;

import com.you.lld.problems.library.api.NotificationService;

/**
 * Simple notification implementation that prints to stdout.
 * Swappable with EmailNotificationService, SMSNotificationService, etc.
 */
public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String memberId, String message) {
        System.out.println("[NOTIFY -> " + memberId + "] " + message);
    }
}
```

</details>

### `impl/LibraryServiceImpl.java`

<details>
<summary>Click to view impl/LibraryServiceImpl.java</summary>

```java
package com.you.lld.problems.library.impl;

import com.you.lld.problems.library.api.LibraryService;
import com.you.lld.problems.library.api.NotificationService;
import com.you.lld.problems.library.exceptions.*;
import com.you.lld.problems.library.model.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory library service with:
 * <ul>
 *   <li>Role-based access control (LIBRARIAN vs MEMBER)</li>
 *   <li>Book (catalog) vs BookItem (physical copy) separation</li>
 *   <li>Fine-grained locking per BookItem for borrow/return/renew</li>
 *   <li>FIFO reservation queue per ISBN, fulfilled on return</li>
 *   <li>Due-date tracking with overdue fine calculation ($1/day)</li>
 *   <li>Renewal support (max 2, blocked if reservation exists)</li>
 *   <li>Observer-based notifications</li>
 * </ul>
 */
public class LibraryServiceImpl implements LibraryService {

    private static final double FINE_PER_DAY = 1.0;

    private final Map<String, Book> books = new ConcurrentHashMap<>();
    private final Map<String, BookItem> bookItems = new ConcurrentHashMap<>();
    private final Map<String, Member> members = new ConcurrentHashMap<>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();
    private final List<Transaction> transactions = new CopyOnWriteArrayList<>();

    private final Map<String, List<String>> isbnToBarcodes = new ConcurrentHashMap<>();
    private final Map<String, Queue<Reservation>> reservationQueues = new ConcurrentHashMap<>();
    private final Set<String> registeredEmails = ConcurrentHashMap.newKeySet();

    private final AtomicLong barcodeSeq = new AtomicLong(0);
    private final AtomicLong txnSeq = new AtomicLong(0);
    private final AtomicLong resSeq = new AtomicLong(0);

    private final List<NotificationService> notifiers = new CopyOnWriteArrayList<>();

    public LibraryServiceImpl() {}

    public void addNotifier(NotificationService notifier) {
        notifiers.add(notifier);
    }

    // ==================== Authorization helpers ====================

    private Member requireLibrarian(String accountId) {
        Member account = getMember(accountId);
        if (!account.isLibrarian()) {
            throw new UnauthorizedException(
                    "Only librarians can perform this operation (account: " + accountId + ")");
        }
        return account;
    }

    private Member requireMember(String accountId) {
        Member account = getMember(accountId);
        if (!account.isMember()) {
            throw new UnauthorizedException(
                    "This operation is for members only (account: " + accountId + ")");
        }
        return account;
    }

    // ==================== Catalog (LIBRARIAN only) ====================

    @Override
    public void addBook(String accountId, Book book) {
        requireLibrarian(accountId);
        if (books.containsKey(book.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN " + book.getIsbn() + " already exists");
        }
        books.put(book.getIsbn(), book);
    }

    @Override
    public String addBookItem(String accountId, String isbn, Rack rack) {
        requireLibrarian(accountId);
        Book book = books.get(isbn);
        if (book == null) {
            throw new BookNotFoundException("No catalog entry for ISBN: " + isbn);
        }
        String barcode = "BC-" + barcodeSeq.incrementAndGet();
        BookItem item = new BookItem(barcode, isbn, rack);
        bookItems.put(barcode, item);
        isbnToBarcodes.computeIfAbsent(isbn, k -> new CopyOnWriteArrayList<>()).add(barcode);
        return barcode;
    }

    @Override
    public Book getBook(String isbn) {
        Book book = books.get(isbn);
        if (book == null) throw new BookNotFoundException("ISBN not found: " + isbn);
        return book;
    }

    // ==================== Members ====================

    @Override
    public String registerMember(String accountId, String name, String email) {
        requireLibrarian(accountId);
        return createAccount(name, email, AccountType.MEMBER);
    }

    @Override
    public String registerLibrarian(String name, String email) {
        return createAccount(name, email, AccountType.LIBRARIAN);
    }

    private String createAccount(String name, String email, AccountType type) {
        if (!registeredEmails.add(email.toLowerCase())) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }
        String id = (type == AccountType.LIBRARIAN ? "LIB-" : "MEM-")
                + UUID.randomUUID().toString().substring(0, 8);
        Member account = new Member(id, name, email, type);
        members.put(id, account);
        return id;
    }

    @Override
    public Member getMember(String memberId) {
        Member m = members.get(memberId);
        if (m == null) throw new MemberNotFoundException("Account not found: " + memberId);
        return m;
    }

    // ==================== Borrow (MEMBER only) ====================

    @Override
    public void borrowBook(String memberId, String barcode) {
        Member member = requireMember(memberId);
        BookItem item = getBookItem(barcode);

        if (!member.canBorrow()) {
            if (member.getTotalFinesOwed() > 0) {
                throw new OutstandingFineException(
                        "Member has $" + String.format("%.2f", member.getTotalFinesOwed())
                                + " in unpaid fines");
            }
            throw new MaxBorrowLimitException(
                    "Member has reached the borrowing limit of " + member.getMaxBooksAllowed());
        }

        // State pattern handles validation:
        //   AvailableState.checkout -> succeeds
        //   ReservedState.checkout  -> succeeds only if memberId matches reserved member
        //   BorrowedState.checkout  -> throws IllegalStateException
        synchronized (item) {
            item.checkout(memberId);
            member.addBorrowedItem(barcode);
        }

        fulfillReservationForMember(item.getIsbn(), memberId);

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.BORROW));
    }

    // ==================== Return (MEMBER only) ====================

    @Override
    public double returnBook(String memberId, String barcode) {
        Member member = requireMember(memberId);
        BookItem item = getBookItem(barcode);

        double fineAmount = 0.0;

        synchronized (item) {
            if (!memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "BookItem " + barcode + " is not borrowed by member " + memberId);
            }

            if (item.isOverdue()) {
                long daysOverdue = ChronoUnit.DAYS.between(item.getDueDate(), LocalDate.now());
                fineAmount = daysOverdue * FINE_PER_DAY;
                member.chargeFine(fineAmount);
            }

            item.returnItem();
            member.removeBorrowedItem(barcode);
        }

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.RETURN, fineAmount));

        if (fineAmount > 0) {
            notifyMember(memberId, "Fine of $" + String.format("%.2f", fineAmount)
                    + " charged for overdue return of " + barcode);
        }

        processReservationQueue(item);
        return fineAmount;
    }

    // ==================== Renew (MEMBER only) ====================

    @Override
    public void renewBook(String memberId, String barcode) {
        requireMember(memberId);
        BookItem item = getBookItem(barcode);

        synchronized (item) {
            if (!memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "BookItem " + barcode + " is not borrowed by member " + memberId);
            }

            // Business rule: can't renew if someone else is waiting
            Queue<Reservation> queue = reservationQueues.get(item.getIsbn());
            if (queue != null && !queue.isEmpty()) {
                throw new IllegalStateException(
                        "Cannot renew -- there is an active reservation for ISBN " + item.getIsbn());
            }

            // State handles max-renewal validation (BorrowedState.renew throws if exceeded)
            item.renew();
        }

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.RENEW));
    }

    // ==================== Reservations (MEMBER only) ====================

    @Override
    public String reserveBook(String memberId, String isbn) {
        requireMember(memberId);
        getBook(isbn);

        List<String> barcodes = isbnToBarcodes.getOrDefault(isbn, Collections.emptyList());
        for (String bc : barcodes) {
            BookItem item = bookItems.get(bc);
            if (item != null && memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "Member already has a copy of ISBN " + isbn + " (barcode: " + bc + ")");
            }
        }

        for (String bc : barcodes) {
            BookItem item = bookItems.get(bc);
            if (item != null && item.isAvailable()) {
                throw new IllegalStateException(
                        "A copy is available (barcode: " + bc + ") -- borrow it directly instead");
            }
        }

        Queue<Reservation> queue = reservationQueues.computeIfAbsent(
                isbn, k -> new LinkedBlockingDeque<>());
        for (Reservation r : queue) {
            if (r.getMemberId().equals(memberId) && r.getStatus() == ReservationStatus.WAITING) {
                throw new IllegalStateException(
                        "Member already has a pending reservation for ISBN " + isbn);
            }
        }

        String resId = "RES-" + resSeq.incrementAndGet();
        Reservation reservation = new Reservation(resId, memberId, isbn);
        reservations.put(resId, reservation);
        queue.add(reservation);

        transactions.add(new Transaction(
                nextTxnId(), memberId, "ISBN:" + isbn, TransactionType.RESERVE));

        notifyMember(memberId, "Reservation " + resId + " placed for ISBN " + isbn
                + ". You are #" + queue.size() + " in the queue.");
        return resId;
    }

    @Override
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.get(reservationId);
        if (res == null) {
            throw new ReservationNotFoundException("Reservation not found: " + reservationId);
        }
        res.setStatus(ReservationStatus.CANCELLED);

        Queue<Reservation> queue = reservationQueues.get(res.getIsbn());
        if (queue != null) {
            queue.removeIf(r -> r.getId().equals(reservationId));
        }
    }

    // ==================== Search (ANY role) ====================

    @Override
    public List<Book> searchByTitle(String keyword) {
        String lower = keyword.toLowerCase();
        return books.values().stream()
                .filter(b -> b.getTitle().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    @Override
    public List<Book> searchByAuthor(String keyword) {
        String lower = keyword.toLowerCase();
        return books.values().stream()
                .filter(b -> b.getAuthor().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    @Override
    public Book searchByIsbn(String isbn) {
        return books.get(isbn);
    }

    @Override
    public List<BookItem> getAvailableCopies(String isbn) {
        List<String> barcodes = isbnToBarcodes.getOrDefault(isbn, Collections.emptyList());
        return barcodes.stream()
                .map(bookItems::get)
                .filter(Objects::nonNull)
                .filter(BookItem::isAvailable)
                .collect(Collectors.toList());
    }

    // ==================== Fines ====================

    @Override
    public double getOutstandingFines(String memberId) {
        return getMember(memberId).getTotalFinesOwed();
    }

    @Override
    public void payFine(String memberId, double amount) {
        Member member = getMember(memberId);
        if (amount <= 0) throw new IllegalArgumentException("Payment amount must be positive");
        if (amount > member.getTotalFinesOwed()) {
            throw new IllegalArgumentException("Payment $" + String.format("%.2f", amount)
                    + " exceeds outstanding fines $"
                    + String.format("%.2f", member.getTotalFinesOwed()));
        }
        member.payFine(amount);
        notifyMember(memberId, "Payment of $" + String.format("%.2f", amount)
                + " received. Remaining fines: $"
                + String.format("%.2f", member.getTotalFinesOwed()));
    }

    // ==================== History ====================

    @Override
    public List<Transaction> getMemberHistory(String memberId) {
        getMember(memberId);
        return transactions.stream()
                .filter(t -> t.getMemberId().equals(memberId))
                .collect(Collectors.toList());
    }

    // ==================== Internal helpers ====================

    private BookItem getBookItem(String barcode) {
        BookItem item = bookItems.get(barcode);
        if (item == null) throw new BookNotFoundException("BookItem not found: " + barcode);
        return item;
    }

    private void processReservationQueue(BookItem returnedItem) {
        Queue<Reservation> queue = reservationQueues.get(returnedItem.getIsbn());
        if (queue == null || queue.isEmpty()) return;

        Reservation next = null;
        while (!queue.isEmpty()) {
            Reservation candidate = queue.peek();
            if (candidate.getStatus() == ReservationStatus.WAITING) {
                next = candidate;
                break;
            }
            queue.poll();
        }

        if (next != null) {
            synchronized (returnedItem) {
                if (returnedItem.isAvailable()) {
                    // State transition: Available -> Reserved (for this member)
                    returnedItem.reserve(next.getMemberId());
                    next.setStatus(ReservationStatus.FULFILLED);
                    queue.poll();

                    notifyMember(next.getMemberId(),
                            "Your reservation for ISBN " + returnedItem.getIsbn()
                                    + " is ready! Barcode: " + returnedItem.getBarcode()
                                    + ". Please pick up within 3 days.");
                }
            }
        }
    }

    private void fulfillReservationForMember(String isbn, String memberId) {
        Queue<Reservation> queue = reservationQueues.get(isbn);
        if (queue != null) {
            queue.removeIf(r -> r.getMemberId().equals(memberId)
                    && r.getStatus() == ReservationStatus.FULFILLED);
        }
    }

    private void notifyMember(String memberId, String message) {
        for (NotificationService ns : notifiers) {
            ns.notify(memberId, message);
        }
    }

    private String nextTxnId() {
        return "TXN-" + txnSeq.incrementAndGet();
    }
}
```

</details>

### `exceptions/BookNotAvailableException.java`

<details>
<summary>Click to view exceptions/BookNotAvailableException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class BookNotAvailableException extends RuntimeException {
    public BookNotAvailableException(String message) { super(message); }
}
```

</details>

### `exceptions/BookNotFoundException.java`

<details>
<summary>Click to view exceptions/BookNotFoundException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/MaxBorrowLimitException.java`

<details>
<summary>Click to view exceptions/MaxBorrowLimitException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class MaxBorrowLimitException extends RuntimeException {
    public MaxBorrowLimitException(String message) { super(message); }
}
```

</details>

### `exceptions/MemberNotFoundException.java`

<details>
<summary>Click to view exceptions/MemberNotFoundException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/OutstandingFineException.java`

<details>
<summary>Click to view exceptions/OutstandingFineException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class OutstandingFineException extends RuntimeException {
    public OutstandingFineException(String message) { super(message); }
}
```

</details>

### `exceptions/ReservationNotFoundException.java`

<details>
<summary>Click to view exceptions/ReservationNotFoundException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class ReservationNotFoundException extends RuntimeException {
    public ReservationNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/UnauthorizedException.java`

<details>
<summary>Click to view exceptions/UnauthorizedException.java</summary>

```java
package com.you.lld.problems.library.exceptions;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) { super(message); }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.library.LibraryDemo"
```
