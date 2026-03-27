package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Physical copy of a Book. Each BookItem has a unique barcode.
 *
 * Uses the State pattern for lifecycle transitions:
 *   Available  --checkout-->  Borrowed
 *   Available  --reserve-->   Reserved
 *   Borrowed   --return-->    Available
 *   Borrowed   --renew-->     Borrowed (extended due date)
 *   Reserved   --checkout-->  Borrowed (reserved member only)
 *
 * Invalid transitions throw IllegalStateException from the state objects.
 * Thread safety: mutations happen under synchronized(this) in the service layer.
 */
public class BookItem {
    private final String barcode;
    private final String isbn;
    private final Rack rack;

    private BookItemState state;
    private String borrowedBy;
    private LocalDate dueDate;
    private int renewalCount;

    public static final int LOAN_PERIOD_DAYS = 14;
    public static final int MAX_RENEWALS = 2;

    public BookItem(String barcode, String isbn, Rack rack) {
        this.barcode = barcode;
        this.isbn = isbn;
        this.rack = rack;
        this.state = AvailableState.INSTANCE;
        this.renewalCount = 0;
    }

    // --- State-delegated operations ---

    public void checkout(String memberId) {
        this.state = state.checkout(this, memberId);
    }

    public void returnItem() {
        this.state = state.returnItem(this);
    }

    public boolean renew() {
        return state.renew(this);
    }

    public void reserve(String memberId) {
        this.state = state.reserve(this, memberId);
    }

    // --- Queries (delegated to state) ---

    public boolean isAvailable() { return state.isAvailable(); }

    public BookStatus getStatus() { return state.getStatus(); }

    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate);
    }

    // --- Package-private setters for state objects ---

    void setBorrowedByInternal(String memberId) { this.borrowedBy = memberId; }
    void setDueDateInternal(LocalDate dueDate) { this.dueDate = dueDate; }
    void setRenewalCountInternal(int count) { this.renewalCount = count; }

    // --- Public getters ---

    public String getBarcode() { return barcode; }
    public String getIsbn() { return isbn; }
    public Rack getRack() { return rack; }
    public String getBorrowedBy() { return borrowedBy; }
    public LocalDate getDueDate() { return dueDate; }
    public int getRenewalCount() { return renewalCount; }

    @Override
    public String toString() {
        return "BookItem[" + barcode + ", isbn=" + isbn + ", state=" + state
                + (borrowedBy != null ? ", borrowedBy=" + borrowedBy : "")
                + (dueDate != null ? ", due=" + dueDate : "") + "]";
    }
}
