package com.you.lld.problems.airlinebooking.model;

/**
 * State pattern: encapsulates the legal lifecycle transitions of a {@link Booking}.
 *
 * <p>Each concrete state answers "what happens when the booking is confirmed /
 * cancelled / expired while in this state?" — either advancing the booking to a
 * new state or rejecting the transition with an {@link IllegalStateException}.
 * The {@link Booking} is the context and delegates all lifecycle calls here, so
 * the transition table lives in one place per state instead of a sprawling
 * {@code switch} on {@link BookingStatus}.
 *
 * <p>States are stateless singletons (no per-booking fields) and therefore
 * thread-safe to share.
 */
public interface BookingState {

    /** Confirm a held booking into a ticketed booking. */
    void confirm(Booking booking);

    /** Cancel the booking, releasing its seat. */
    void cancel(Booking booking);

    /** Expire a stale hold whose TTL elapsed before confirmation. */
    void expire(Booking booking);

    /** The status this state represents. */
    BookingStatus status();
}
