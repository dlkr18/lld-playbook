package com.you.lld.problems.library.model;

/**
 * State pattern for BookItem lifecycle.
 *
 * Each state defines which transitions are legal:
 *   AvailableState  -> checkout -> BorrowedState
 *   AvailableState  -> reserve  -> ReservedState
 *   BorrowedState   -> return   -> AvailableState
 *   BorrowedState   -> renew    -> BorrowedState (with extended due date)
 *   ReservedState   -> checkout -> BorrowedState (only by the reserved member)
 *
 * Invalid transitions throw IllegalStateException with a clear message.
 * Implementations are stateless singletons -- all mutable data lives on BookItem.
 */
public interface BookItemState {

    /** Attempt to check out this item to a member. Returns the next state. */
    BookItemState checkout(BookItem item, String memberId);

    /** Attempt to return this item. Returns the next state. */
    BookItemState returnItem(BookItem item);

    /** Attempt to renew this item. Returns true if renewed, throws if not possible. */
    boolean renew(BookItem item);

    /** Attempt to reserve this item for a member. Returns the next state. */
    BookItemState reserve(BookItem item, String memberId);

    boolean isAvailable();

    BookStatus getStatus();
}
