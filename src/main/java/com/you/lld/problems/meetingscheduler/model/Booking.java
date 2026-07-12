package com.you.lld.problems.meetingscheduler.model;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Immutable record of a confirmed (or subsequently cancelled) reservation of a
 * {@link Room} for a {@link TimeInterval}.
 *
 * <p>Immutability is deliberate: a booking is a fact once it is confirmed. State
 * transitions (cancellation) produce a NEW {@code Booking} via {@link #cancelled()}
 * rather than mutating in place, so any reference already handed out stays a
 * stable snapshot. This also sidesteps a whole class of visibility bugs under
 * concurrency — there is no mutable field to publish safely.
 */
public final class Booking {

    private final String id;
    private final Room room;
    private final TimeInterval interval;
    private final Attendee organizer;
    private final Set<Attendee> attendees;
    private final String title;
    private final BookingStatus status;

    public Booking(String id,
                   Room room,
                   TimeInterval interval,
                   Attendee organizer,
                   Set<Attendee> attendees,
                   String title) {
        this(id, room, interval, organizer, attendees, title, BookingStatus.CONFIRMED);
    }

    private Booking(String id,
                    Room room,
                    TimeInterval interval,
                    Attendee organizer,
                    Set<Attendee> attendees,
                    String title,
                    BookingStatus status) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("booking id must not be blank");
        }
        if (room == null) {
            throw new IllegalArgumentException("room must not be null");
        }
        if (interval == null) {
            throw new IllegalArgumentException("interval must not be null");
        }
        if (organizer == null) {
            throw new IllegalArgumentException("organizer must not be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("title must not be blank");
        }
        // Defensive copy: attendees always includes the organizer.
        Set<Attendee> copy = new LinkedHashSet<Attendee>();
        copy.add(organizer);
        if (attendees != null) {
            copy.addAll(attendees);
        }
        if (copy.size() > room.getCapacity()) {
            throw new IllegalArgumentException(
                "attendee count " + copy.size() + " exceeds room capacity " + room.getCapacity());
        }
        this.id = id;
        this.room = room;
        this.interval = interval;
        this.organizer = organizer;
        this.attendees = Collections.unmodifiableSet(copy);
        this.title = title;
        this.status = status;
    }

    /** Returns a CANCELLED copy of this booking. */
    public Booking cancelled() {
        return new Booking(id, room, interval, organizer, attendees, title, BookingStatus.CANCELLED);
    }

    public String getId() {
        return id;
    }

    public Room getRoom() {
        return room;
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

    public BookingStatus getStatus() {
        return status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Booking) o).id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Booking{" + id + " '" + title + "' room=" + room.getId()
            + " " + interval + " attendees=" + attendees.size()
            + " status=" + status + "}";
    }
}
