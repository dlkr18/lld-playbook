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
