package com.you.lld.problems.meetingscheduler.service;

import com.you.lld.problems.meetingscheduler.model.Booking;

/**
 * Observer pattern: reacts to booking lifecycle events. Keeping notification out
 * of {@code Booking}/{@code MeetingScheduler} honours SRP — the scheduler owns
 * "reserve the slot", observers own "tell people / update calendars / audit".
 *
 * <p>Called by the orchestrator AFTER the slot mutation has committed, and
 * OUTSIDE the room lock, so a slow/faulty observer can never extend the critical
 * section or deadlock the booking path.
 */
public interface BookingObserver {

    void onBooked(Booking booking);

    void onCancelled(Booking booking);
}
