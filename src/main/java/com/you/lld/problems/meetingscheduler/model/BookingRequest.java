package com.you.lld.problems.meetingscheduler.model;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Immutable command object bundling everything needed to attempt a booking.
 * Keeps the orchestrator's method signatures small and lets the same request be
 * reused when expanding a recurring meeting into concrete occurrences.
 *
 * <p>{@code roomId} may be {@code null} when the caller wants the scheduler to
 * pick a room via the active allocation strategy (see {@code bookAny}).
 */
public final class BookingRequest {

    private final String roomId; // nullable: null => let the strategy choose
    private final TimeInterval interval;
    private final Attendee organizer;
    private final Set<Attendee> attendees;
    private final String title;

    public BookingRequest(String roomId,
                          TimeInterval interval,
                          Attendee organizer,
                          Set<Attendee> attendees,
                          String title) {
        if (interval == null) {
            throw new IllegalArgumentException("interval must not be null");
        }
        if (organizer == null) {
            throw new IllegalArgumentException("organizer must not be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("title must not be blank");
        }
        Set<Attendee> copy = new LinkedHashSet<Attendee>();
        if (attendees != null) {
            copy.addAll(attendees);
        }
        this.roomId = roomId;
        this.interval = interval;
        this.organizer = organizer;
        this.attendees = Collections.unmodifiableSet(copy);
        this.title = title;
    }

    /** Returns a copy of this request retargeted at a different interval (used by recurrence expansion). */
    public BookingRequest withInterval(TimeInterval newInterval) {
        return new BookingRequest(roomId, newInterval, organizer, attendees, title);
    }

    /** Total headcount = organizer + explicitly listed attendees (organizer de-duplicated). */
    public int headcount() {
        Set<Attendee> all = new LinkedHashSet<Attendee>();
        all.add(organizer);
        all.addAll(attendees);
        return all.size();
    }

    public String getRoomId() {
        return roomId;
    }

    public TimeInterval getInterval() {
        return interval;
    }

    public Attendee getOrganizer() {
        return organizer;
    }

    public Set<Attendee> getAttendees() {
        return attendees;
    }

    public String getTitle() {
        return title;
    }
}
