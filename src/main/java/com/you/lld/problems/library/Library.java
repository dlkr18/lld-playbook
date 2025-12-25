package com.you.lld.problems.library;
import java.util.*;

public class Library {
    private final Map<String, Book> books;
    private final Map<String, Member> members;
    private final Map<String, List<String>> loans; // memberId -> bookIsbns
    
    public Library() {
        this.books = new HashMap<>();
        this.members = new HashMap<>();
        this.loans = new HashMap<>();
    }
    
    public void addBook(Book book) {
        books.put(book.getIsbn(), book);
    }
    
    public boolean checkoutBook(String isbn, String memberId) {
        Book book = books.get(isbn);
        if (book != null && book.isAvailable()) {
            book.setAvailable(false);
            loans.computeIfAbsent(memberId, k -> new ArrayList<>()).add(isbn);
            return true;
        }
        return false;
    }
    
    public void returnBook(String isbn, String memberId) {
        Book book = books.get(isbn);
        if (book != null) {
            book.setAvailable(true);
            List<String> memberLoans = loans.get(memberId);
            if (memberLoans != null) {
                memberLoans.remove(isbn);
            }
        }
    }
}
