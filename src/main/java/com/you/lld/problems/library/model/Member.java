package com.you.lld.problems.library.model;

import java.time.LocalDate;
import java.util.*;

public class Member {
    private final String id;
    private final String name;
    private final String email;
    private final LocalDate memberSince;
    private final List<String> borrowedBooks;
    private final int maxBooksAllowed;
    
    public Member(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.memberSince = LocalDate.now();
        this.borrowedBooks = new ArrayList<>();
        this.maxBooksAllowed = 5;
    }
    
    public boolean canBorrowMore() {
        return borrowedBooks.size() < maxBooksAllowed;
    }
    
    public void addBorrowedBook(String isbn) {
        borrowedBooks.add(isbn);
    }
    
    public void removeBorrowedBook(String isbn) {
        borrowedBooks.remove(isbn);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public List<String> getBorrowedBooks() { return new ArrayList<>(borrowedBooks); }
    
    @Override
    public String toString() {
        return name + " (ID: " + id + ") - Books borrowed: " + borrowedBooks.size();
    }
}
