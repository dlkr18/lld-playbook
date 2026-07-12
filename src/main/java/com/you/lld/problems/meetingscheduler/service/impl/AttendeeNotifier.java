package com.you.lld.problems.meetingscheduler.service.impl;

import com.you.lld.problems.meetingscheduler.model.Attendee;
import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.service.BookingObserver;

import java.io.PrintStream;

/**
 * {@link BookingObserver} that "emails" every attendee on booking / cancellation.
 * Here it just prints; in production this would enqueue notifications. Writing to
 * an injectable {@link PrintStream} keeps it testable and decoupled from
 * {@code System.out}.
 */
public class AttendeeNotifier implements BookingObserver {

    private final PrintStream out;

    public AttendeeNotifier() {
        this(System.out);
    }

    public AttendeeNotifier(PrintStream out) {
        this.out = out;
    }

    @Override
    public void onBooked(Booking booking) {
        for (Attendee attendee : booking.getAttendees()) {
            out.println("  [notify] -> " + attendee.getName()
                + ": '" + booking.getTitle() + "' CONFIRMED in room "
                + booking.getRoom().getId() + " " + booking.getInterval());
        }
    }

    @Override
    public void onCancelled(Booking booking) {
        for (Attendee attendee : booking.getAttendees()) {
            out.println("  [notify] -> " + attendee.getName()
                + ": '" + booking.getTitle() + "' CANCELLED (room "
                + booking.getRoom().getId() + " " + booking.getInterval() + ")");
        }
    }
}
