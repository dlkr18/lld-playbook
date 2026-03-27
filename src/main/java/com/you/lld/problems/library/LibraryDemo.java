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
