package com.you.lld.problems.bookmyshow.model;

/**
 * State pattern for Booking lifecycle.
 * Each state defines which transitions are legal; invalid ops throw IllegalStateException.
 *
 *   Pending  --confirm-->  Confirmed
 *   Pending  --cancel-->   Cancelled
 *   Pending  --expire-->   Expired   (lock timeout)
 *   Confirmed --cancel-->  Cancelled
 *   Cancelled / Expired    terminal (all throw)
 *
 * States are STATELESS singletons -- all mutable data lives on Booking.
 * Side effects (seat release, refund) are handled by the service, not the states.
 */
public interface BookingState {
    BookingState confirm(Booking booking, Payment payment);
    BookingState cancel(Booking booking);
    BookingState expire(Booking booking);
    BookingStatus getStatus();
}
