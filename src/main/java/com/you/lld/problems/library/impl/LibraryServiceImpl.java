package com.you.lld.problems.library.impl;

import com.you.lld.problems.library.api.LibraryService;
import com.you.lld.problems.library.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class LibraryServiceImpl implements LibraryService {
    private final Map<String, Book> books = new ConcurrentHashMap<>();
    private final Map<String, Member> members = new ConcurrentHashMap<>();
    private final List<Transaction> transactions = new ArrayList<>();
    
    @Override
    public void addBook(Book book) {
        books.put(book.getIsbn(), book);
        System.out.println("Book added: " + book.getTitle());
    }
    
    @Override
    public String registerMember(String name, String email) {
        String memberId = UUID.randomUUID().toString();
        Member member = new Member(memberId, name, email);
        members.put(memberId, member);
        System.out.println("Member registered: " + name);
        return memberId;
    }
    
    @Override
    public synchronized boolean borrowBook(String memberId, String isbn) {
        Member member = members.get(memberId);
        Book book = books.get(isbn);
        
        if (member == null || book == null) {
            return false;
        }
        
        if (!member.canBorrowMore()) {
            System.out.println("Member has reached borrowing limit");
            return false;
        }
        
        if (book.getStatus() != BookStatus.AVAILABLE) {
            System.out.println("Book not available");
            return false;
        }
        
        book.borrow(memberId);
        member.addBorrowedBook(isbn);
        
        Transaction txn = new Transaction(
            UUID.randomUUID().toString(), memberId, isbn, TransactionType.BORROW
        );
        transactions.add(txn);
        
        System.out.println("Book borrowed: " + book.getTitle() + " by " + member.getName());
        return true;
    }
    
    @Override
    public synchronized boolean returnBook(String memberId, String isbn) {
        Member member = members.get(memberId);
        Book book = books.get(isbn);
        
        if (member == null || book == null) {
            return false;
        }
        
        if (!member.getBorrowedBooks().contains(isbn)) {
            System.out.println("Book not borrowed by this member");
            return false;
        }
        
        book.returnBook();
        member.removeBorrowedBook(isbn);
        
        Transaction txn = new Transaction(
            UUID.randomUUID().toString(), memberId, isbn, TransactionType.RETURN
        );
        transactions.add(txn);
        
        System.out.println("Book returned: " + book.getTitle() + " by " + member.getName());
        return true;
    }
    
    @Override
    public List<Book> searchByTitle(String title) {
        return books.values().stream()
            .filter(book -> book.getTitle().toLowerCase().contains(title.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Book> searchByAuthor(String author) {
        return books.values().stream()
            .filter(book -> book.getAuthor().toLowerCase().contains(author.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Transaction> getMemberHistory(String memberId) {
        return transactions.stream()
            .filter(txn -> txn.getType().equals(TransactionType.BORROW) || 
                          txn.getType().equals(TransactionType.RETURN))
            .collect(Collectors.toList());
    }
}
