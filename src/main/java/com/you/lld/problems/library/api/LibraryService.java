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
