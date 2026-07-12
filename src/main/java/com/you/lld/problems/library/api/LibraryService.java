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
