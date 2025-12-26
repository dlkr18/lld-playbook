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
