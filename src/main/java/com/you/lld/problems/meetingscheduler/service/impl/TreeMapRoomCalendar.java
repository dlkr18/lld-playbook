package com.you.lld.problems.meetingscheduler.service.impl;

import com.you.lld.problems.meetingscheduler.exception.BookingConflictException;
import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.model.TimeInterval;
import com.you.lld.problems.meetingscheduler.service.RoomCalendar;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.Optional;
import java.util.TreeMap;

/**
 * {@link RoomCalendar} backed by a {@link TreeMap} keyed by each booking's start
 * time. This buys O(log n) overlap detection: for a candidate {@code [s, e)} we
 * only need to inspect the two neighbouring intervals.
 *
 * <p><b>Overlap detection (the "My Calendar" trick).</b> Bookings are
 * non-overlapping and sorted by start, so at most two existing intervals can
 * collide with a new one:
 * <ul>
 *   <li>the interval with the greatest start {@code <= s} ({@code floorEntry(s)})
 *       — it collides iff its end {@code > s};</li>
 *   <li>the interval with the least start {@code >= s} ({@code ceilingEntry(s)})
 *       — it collides iff its start {@code < e}.</li>
 * </ul>
 * Both are O(log n) navigations. No linear scan of the day is needed.
 *
 * <p><b>Thread-safety:</b> intentionally NONE here. The orchestrator holds the
 * per-room lock across {@code isFree}+{@code book}, so this class stays a plain,
 * fast data structure. Never share an instance without that external lock.
 */
public class TreeMapRoomCalendar implements RoomCalendar {

    private final TreeMap<LocalDateTime, Booking> bookingsByStart = new TreeMap<LocalDateTime, Booking>();

    @Override
    public boolean isFree(TimeInterval interval) {
        LocalDateTime s = interval.getStart();
        LocalDateTime e = interval.getEnd();

        Map.Entry<LocalDateTime, Booking> floor = bookingsByStart.floorEntry(s);
        if (floor != null && floor.getValue().getInterval().getEnd().isAfter(s)) {
            return false; // an earlier-starting meeting runs past s
        }

        Map.Entry<LocalDateTime, Booking> ceiling = bookingsByStart.ceilingEntry(s);
        if (ceiling != null && ceiling.getValue().getInterval().getStart().isBefore(e)) {
            return false; // a later-starting meeting begins before e
        }
        return true;
    }

    @Override
    public void book(Booking booking) {
        if (!isFree(booking.getInterval())) {
            throw new BookingConflictException(
                "interval " + booking.getInterval() + " conflicts with an existing booking in room "
                    + booking.getRoom().getId());
        }
        bookingsByStart.put(booking.getInterval().getStart(), booking);
    }

    @Override
    public boolean cancel(Booking booking) {
        LocalDateTime start = booking.getInterval().getStart();
        Booking existing = bookingsByStart.get(start);
        if (existing != null && existing.getId().equals(booking.getId())) {
            bookingsByStart.remove(start);
            return true;
        }
        return false;
    }

    @Override
    public List<Booking> scheduleFor(LocalDate day) {
        TimeInterval dayWindow = new TimeInterval(day.atStartOfDay(), day.plusDays(1).atStartOfDay());
        List<Booking> result = new ArrayList<Booking>();
        for (Booking b : bookingsByStart.values()) {
            if (b.getInterval().overlaps(dayWindow)) {
                result.add(b);
            }
        }
        return result; // already ordered by start (TreeMap iteration order)
    }

    @Override
    public List<Booking> allBookings() {
        return new ArrayList<Booking>(bookingsByStart.values());
    }

    @Override
    public Optional<TimeInterval> earliestFreeSlot(TimeInterval window, Duration duration) {
        if (duration == null || duration.isZero() || duration.isNegative()) {
            throw new IllegalArgumentException("duration must be positive");
        }
        LocalDateTime windowStart = window.getStart();
        LocalDateTime windowEnd = window.getEnd();
        if (Duration.between(windowStart, windowEnd).compareTo(duration) < 0) {
            return Optional.empty(); // window itself is too short
        }

        LocalDateTime cursor = windowStart;

        // A meeting starting before the window may spill into it; advance past it.
        Map.Entry<LocalDateTime, Booking> before = bookingsByStart.lowerEntry(windowStart);
        if (before != null && before.getValue().getInterval().getEnd().isAfter(cursor)) {
            cursor = before.getValue().getInterval().getEnd();
        }

        // Only meetings starting inside the window matter from here on.
        NavigableMap<LocalDateTime, Booking> inWindow =
            bookingsByStart.subMap(windowStart, true, windowEnd, false);
        for (Booking b : inWindow.values()) {
            LocalDateTime bStart = b.getInterval().getStart();
            if (!bStart.isAfter(cursor)) {
                // Booking starts at/before the cursor: just advance the cursor.
                if (b.getInterval().getEnd().isAfter(cursor)) {
                    cursor = b.getInterval().getEnd();
                }
                continue;
            }
            // Gap [cursor, bStart) — does the meeting fit?
            if (Duration.between(cursor, bStart).compareTo(duration) >= 0) {
                return Optional.of(TimeInterval.of(cursor, duration));
            }
            cursor = b.getInterval().getEnd();
            if (!cursor.isBefore(windowEnd)) {
                return Optional.empty();
            }
        }

        // Final gap between the last meeting and the window end.
        if (Duration.between(cursor, windowEnd).compareTo(duration) >= 0) {
            return Optional.of(TimeInterval.of(cursor, duration));
        }
        return Optional.empty();
    }
}
