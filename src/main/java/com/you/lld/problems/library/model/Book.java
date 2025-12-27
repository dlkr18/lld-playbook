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
