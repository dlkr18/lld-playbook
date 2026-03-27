package com.you.lld.problems.library.model;

/**
 * Book copy is currently checked out by a member.
 * Valid transitions: returnItem -> Available, renew -> Borrowed (extended due date).
 */
public class BorrowedState implements BookItemState {

    public static final BorrowedState INSTANCE = new BorrowedState();

    private BorrowedState() {}

    @Override
    public BookItemState checkout(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Cannot checkout -- item " + item.getBarcode()
                        + " is already borrowed by " + item.getBorrowedBy());
    }

    @Override
    public BookItemState returnItem(BookItem item) {
        item.setBorrowedByInternal(null);
        item.setDueDateInternal(null);
        item.setRenewalCountInternal(0);
        return AvailableState.INSTANCE;
    }

    @Override
    public boolean renew(BookItem item) {
        if (item.getRenewalCount() >= BookItem.MAX_RENEWALS) {
            throw new IllegalStateException(
                    "Max renewals (" + BookItem.MAX_RENEWALS + ") reached for " + item.getBarcode());
        }
        item.setDueDateInternal(item.getDueDate().plusDays(BookItem.LOAN_PERIOD_DAYS));
        item.setRenewalCountInternal(item.getRenewalCount() + 1);
        return true;
    }

    @Override
    public BookItemState reserve(BookItem item, String memberId) {
        throw new IllegalStateException(
                "Cannot reserve -- item " + item.getBarcode() + " is currently borrowed");
    }

    @Override
    public boolean isAvailable() { return false; }

    @Override
    public BookStatus getStatus() { return BookStatus.BORROWED; }

    @Override
    public String toString() { return "BORROWED"; }
}
