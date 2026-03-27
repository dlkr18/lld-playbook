package com.you.lld.problems.library.model;

import java.time.LocalDateTime;

/**
 * Immutable audit record of a library operation.
 */
public class Transaction {
    private final String id;
    private final String memberId;
    private final String barcode;
    private final TransactionType type;
    private final LocalDateTime timestamp;
    private final double fineAmount; // non-zero only for RETURN with overdue

    public Transaction(String id, String memberId, String barcode, TransactionType type) {
        this(id, memberId, barcode, type, 0.0);
    }

    public Transaction(String id, String memberId, String barcode,
                       TransactionType type, double fineAmount) {
        this.id = id;
        this.memberId = memberId;
        this.barcode = barcode;
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.fineAmount = fineAmount;
    }

    public String getId() { return id; }
    public String getMemberId() { return memberId; }
    public String getBarcode() { return barcode; }
    public TransactionType getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public double getFineAmount() { return fineAmount; }

    @Override
    public String toString() {
        String s = type + " [" + barcode + "] by member " + memberId + " at " + timestamp;
        if (fineAmount > 0) s += " (fine: $" + String.format("%.2f", fineAmount) + ")";
        return s;
    }
}
