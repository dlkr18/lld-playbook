# Library Management System

## Problem: Design a Library Management System

**Difficulty**: Medium  
**Pattern**: State, Strategy, Observer  
**Time**: 45-60 min

---

## Key Classes

```java
class Library {
    private Map<String, Book> books;
    private Map<String, Member> members;
    private List<Loan> activeLoans;
    
    void addBook(Book book);
    LoanResult checkoutBook(String bookId, String memberId);
    void returnBook(String loanId);
}

class Book {
    String ISBN;
    String title;
    List<String> authors;
    BookStatus status; // AVAILABLE, CHECKED_OUT, RESERVED
}

class Loan {
    String id;
    Book book;
    Member member;
    LocalDate checkoutDate;
    LocalDate dueDate;
    double fineAmount;
}
```

---

**Status**: ✅ Documented
