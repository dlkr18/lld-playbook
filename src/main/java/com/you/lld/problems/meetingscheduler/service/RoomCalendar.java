package com.you.lld.problems.meetingscheduler.service;

import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.model.TimeInterval;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * The set of confirmed bookings for a SINGLE room, ordered by start time.
 *
 * <p>Implementations are NOT required to be thread-safe on their own — the
 * orchestrator serialises all access to a given room's calendar behind that
 * room's lock, so the check-then-insert in {@link #book(Booking)} is atomic from
 * the caller's perspective. This keeps the data structure simple and fast
 * (no internal synchronisation on the hot path) while concentrating the
 * concurrency reasoning in one place.
 */
public interface RoomCalendar {

    /** @return true iff no confirmed booking overlaps {@code interval}. O(log n). */
    boolean isFree(TimeInterval interval);

    /**
     * Reserve {@code interval} for this room.
     *
     * @throws com.you.lld.problems.meetingscheduler.exception.BookingConflictException
     *         if it overlaps an existing booking.
     */
    void book(Booking booking);

    /**
     * Remove a booking. Idempotent-safe: removes only if the stored booking at
     * that start matches the given id.
     *
     * @return true if a booking was removed.
     */
    boolean cancel(Booking booking);

    /** All bookings that intersect the given calendar day, ordered by start. */
    List<Booking> scheduleFor(LocalDate day);

    /** All bookings in this room, ordered by start. */
    List<Booking> allBookings();

    /**
     * Earliest free sub-interval of exactly {@code duration} that fits entirely
     * inside {@code window}, or empty if the room is fully booked for that window.
     * O(k) over bookings intersecting the window.
     */
    Optional<TimeInterval> earliestFreeSlot(TimeInterval window, Duration duration);
}
