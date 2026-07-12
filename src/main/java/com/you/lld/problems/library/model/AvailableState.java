package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Book copy is on the shelf, ready to be borrowed or reserved.
 * Valid transitions: checkout -> Borrowed, reserve -> Reserved.
 */
public class AvailableState implements BookItemState {

    public static final AvailableState INSTANCE = new AvailableState();

    private AvailableState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        item.setBorrowedByInternal(memberId);
        item.setDueDateInternal(LocalDate.now().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(0);
        return BorrowedState.INSTANCE;
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        throw new IllegalStateException("Cannot return -- item " + item.getBarcode() + " is not borrowed");
    }

    @Override
    public boolean renew(BookItem item) {
        throw new IllegalStateException("Cannot renew -- item " + item.getBarcode() + " is not borrowed");
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        item.setBorrowedByInternal(memberId); // tracks who it's reserved for
        return ReservedState.INSTANCE;
    }

    @Override
    public boolean isAvailable() { return true; }

    @Override
    public BookStatus getStatus() { return BookStatus.AVAILABLE; }

    @Override
    public String toString() { return "AVAILABLE"; }
}
