# library - Complete Implementation

## 📁 Project Structure (11 files)

```
library/
├── Book.java
├── Demo.java
├── Library.java
├── Member.java
├── api/LibraryService.java
├── impl/LibraryServiceImpl.java
├── model/Book.java
├── model/BookStatus.java
├── model/Member.java
├── model/Transaction.java
├── model/TransactionType.java
```

## 📝 Source Code

### 📄 `Book.java`

```java
package com.you.lld.problems.library;
public class Book {
    private final String isbn;
    private String title;
    private String author;
    private boolean available;
    
    public Book(String isbn, String title, String author) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.available = true;
    }
    
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
```

### 📄 `Demo.java`

```java
package com.you.lld.problems.library;
public class Demo { public static void main(String[] args) { System.out.println("Library"); } }```

### 📄 `Library.java`

```java
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
```

### 📄 `Member.java`

```java
package com.you.lld.problems.library;
public class Member {
    private final String memberId;
    private String name;
    
    public Member(String memberId, String name) {
        this.memberId = memberId;
        this.name = name;
    }
    
    public String getMemberId() { return memberId; }
    public String getName() { return name; }
}
```

### 📄 `api/LibraryService.java`

```java
package com.you.lld.problems.library.api;

import com.you.lld.problems.library.model.*;
import java.util.List;

public interface LibraryService {
    void addBook(Book book);
    String registerMember(String name, String email);
    boolean borrowBook(String memberId, String isbn);
    boolean returnBook(String memberId, String isbn);
    List<Book> searchByTitle(String title);
    List<Book> searchByAuthor(String author);
    List<Transaction> getMemberHistory(String memberId);
}
```

### 📄 `impl/LibraryServiceImpl.java`

```java
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
```

### 📄 `model/Book.java`

```java
package com.you.lld.problems.library.model;

public class Book {
    private final String isbn;
    private final String title;
    private final String author;
    private final String publisher;
    private final int publicationYear;
    private BookStatus status;
    private String borrowedBy;
    
    public Book(String isbn, String title, String author, String publisher, int year) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.publicationYear = year;
        this.status = BookStatus.AVAILABLE;
    }
    
    public void borrow(String memberId) {
        this.status = BookStatus.BORROWED;
        this.borrowedBy = memberId;
    }
    
    public void returnBook() {
        this.status = BookStatus.AVAILABLE;
        this.borrowedBy = null;
    }
    
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public BookStatus getStatus() { return status; }
    public String getBorrowedBy() { return borrowedBy; }
    
    @Override
    public String toString() {
        return title + " by " + author + " (" + publicationYear + ") - " + status;
    }
}
```

### 📄 `model/BookStatus.java`

```java
package com.you.lld.problems.library.model;

public enum BookStatus {
    AVAILABLE, BORROWED, RESERVED, MAINTENANCE
}
```

### 📄 `model/Member.java`

```java
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
```

### 📄 `model/Transaction.java`

```java
package com.you.lld.problems.library.model;

import java.time.LocalDateTime;

public class Transaction {
    private final String id;
    private final String memberId;
    private final String bookIsbn;
    private final TransactionType type;
    private final LocalDateTime timestamp;
    
    public Transaction(String id, String memberId, String bookIsbn, TransactionType type) {
        this.id = id;
        this.memberId = memberId;
        this.bookIsbn = bookIsbn;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public TransactionType getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return type + " - Book: " + bookIsbn + " by Member: " + memberId + " at " + timestamp;
    }
}
```

### 📄 `model/TransactionType.java`

```java
package com.you.lld.problems.library.model;

public enum TransactionType {
    BORROW, RETURN, RESERVE, RENEW
}
```

