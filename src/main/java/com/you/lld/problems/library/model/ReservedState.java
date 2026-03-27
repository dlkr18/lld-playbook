package com.you.lld.problems.library.model;

import java.time.LocalDate;

/**
 * Book copy is held for a specific member who placed a reservation.
 * Valid transitions: checkout -> Borrowed (only by the reserved member).
 */
public class ReservedState implements BookItemState {

    public static final ReservedState INSTANCE = new ReservedState();

    private ReservedState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        if (!memberId.equals(item.getBorrowedBy())) {
            throw new IllegalStateException(
                    "Item " + item.getBarcode() + " is reserved for member "
                            + item.getBorrowedBy() + ", not " + memberId);
        }
        // Reserved member is picking up -- transition to Borrowed
        item.setDueDateInternal(LocalDate.now().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(0);
        return BorrowedState.INSTANCE;
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        throw new IllegalStateException(
                "Cannot return -- item " + item.getBarcode() + " is reserved, not borrowed");
    }

    @Override
    public boolean renew(BookItem item) {
        throw new IllegalStateException(
                "Cannot renew -- item " + item.getBarcode() + " is reserved, not borrowed");
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Item " + item.getBarcode() + " is already reserved for member " + item.getBorrowedBy());
    }

    @Override
    public boolean isAvailable() { return false; }

    @Override
    public BookStatus getStatus() { return BookStatus.RESERVED; }

    @Override
    public String toString() { return "RESERVED"; }
}
