package com.you.lld.problems.library;

import com.you.lld.problems.library.impl.LibraryServiceImpl;
import com.you.lld.problems.library.model.Transaction;

import java.util.List;

/**
 * Demo: Library Management with borrow/return, search, transaction history.
 */
public class LibraryDemo {

    public static void main(String[] args) {
        System.out.println("=== Library Management Demo ===\n");

        LibraryServiceImpl service = new LibraryServiceImpl();

        // Add books (using model.Book directly)
        System.out.println("--- Add books ---");
        service.addBook(new com.you.lld.problems.library.model.Book(
            "978-0-13-468599-1", "Design Patterns", "GoF", "Addison-Wesley", 1994));
        service.addBook(new com.you.lld.problems.library.model.Book(
            "978-0-13-235088-4", "Clean Code", "Robert C. Martin", "Prentice Hall", 2008));
        service.addBook(new com.you.lld.problems.library.model.Book(
            "978-0-596-00712-6", "Head First Patterns", "Eric Freeman", "O'Reilly", 2004));
        service.addBook(new com.you.lld.problems.library.model.Book(
            "978-0-13-468599-2", "Effective Java", "Joshua Bloch", "Addison-Wesley", 2018));
        System.out.println("Added 4 books");

        // Register members
        System.out.println("\n--- Register members ---");
        String m1 = service.registerMember("Alice", "alice@example.com");
        String m2 = service.registerMember("Bob", "bob@example.com");
        System.out.println("Registered: Alice=" + m1 + ", Bob=" + m2);

        // Search
        System.out.println("\n--- Search ---");
        List<com.you.lld.problems.library.model.Book> found = service.searchByTitle("Design");
        System.out.println("Search 'Design': " + found.size() + " books");
        for (com.you.lld.problems.library.model.Book b : found) {
            System.out.println("  " + b);
        }

        found = service.searchByAuthor("Robert");
        System.out.println("Search author 'Robert': " + found.size() + " books");

        // Borrow
        System.out.println("\n--- Borrow ---");
        boolean b1 = service.borrowBook(m1, "978-0-13-468599-1");
        System.out.println("Alice borrows Design Patterns: " + b1);
        boolean b2 = service.borrowBook(m2, "978-0-13-235088-4");
        System.out.println("Bob borrows Clean Code: " + b2);

        // Try borrowed book
        boolean b3 = service.borrowBook(m2, "978-0-13-468599-1");
        System.out.println("Bob tries Design Patterns (borrowed): " + b3);

        // Return
        System.out.println("\n--- Return ---");
        boolean r1 = service.returnBook(m1, "978-0-13-468599-1");
        System.out.println("Alice returns Design Patterns: " + r1);

        boolean b4 = service.borrowBook(m2, "978-0-13-468599-1");
        System.out.println("Bob borrows Design Patterns: " + b4);

        // Transaction history
        System.out.println("\n--- Transaction history ---");
        List<Transaction> aliceHistory = service.getMemberHistory(m1);
        System.out.println("Alice's transactions: " + aliceHistory.size());
        for (Transaction t : aliceHistory) {
            System.out.println("  " + t);
        }

        System.out.println("\n=== Demo complete ===");
    }
}
