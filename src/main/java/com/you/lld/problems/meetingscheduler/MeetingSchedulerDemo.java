package com.you.lld.problems.meetingscheduler;

import com.you.lld.problems.meetingscheduler.exception.BookingConflictException;
import com.you.lld.problems.meetingscheduler.model.Attendee;
import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.model.BookingRequest;
import com.you.lld.problems.meetingscheduler.model.Frequency;
import com.you.lld.problems.meetingscheduler.model.RecurrenceRule;
import com.you.lld.problems.meetingscheduler.model.Room;
import com.you.lld.problems.meetingscheduler.model.RoomSlot;
import com.you.lld.problems.meetingscheduler.model.TimeInterval;
import com.you.lld.problems.meetingscheduler.service.impl.AttendeeNotifier;
import com.you.lld.problems.meetingscheduler.service.impl.FirstFitAllocation;
import com.you.lld.problems.meetingscheduler.service.impl.SmallestSufficientCapacityAllocation;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo. Each scenario proves exactly one design point.
 *
 * Run:
 *   mvn -q compile exec:java \
 *     -Dexec.mainClass="com.you.lld.problems.meetingscheduler.MeetingSchedulerDemo"
 */
public class MeetingSchedulerDemo {

    private static final LocalDate DAY = LocalDate.of(2026, 7, 13); // a Monday

    public static void main(String[] args) throws InterruptedException {
        MeetingScheduler scheduler = new MeetingScheduler();
        scheduler.addObserver(new AttendeeNotifier());

        scheduler.registerRoom(new Room("R1-small", 4, "Floor 1"));
        scheduler.registerRoom(new Room("R2-medium", 8, "Floor 2"));
        scheduler.registerRoom(new Room("R3-large", 20, "Floor 3"));

        Attendee alice = new Attendee("u1", "Alice", "alice@corp.com");
        Attendee bob = new Attendee("u2", "Bob", "bob@corp.com");
        Attendee carol = new Attendee("u3", "Carol", "carol@corp.com");

        scenario1_bookAndNotify(scheduler, alice, bob);
        scenario2_conflictAndAdjacency(scheduler, alice, carol);
        scenario3_cancelFreesSlot(scheduler, alice, bob);
        scenario4_findAndSuggest(scheduler, alice, bob, carol);
        scenario5_recurring(scheduler, carol);
        scenario6_concurrencyRace();
    }

    // 1) Book succeeds; Observer notifies attendees (SRP: notification not in the entity).
    private static void scenario1_bookAndNotify(MeetingScheduler scheduler, Attendee alice, Attendee bob) {
        header("Scenario 1 — book a room, observer notifies attendees");
        Booking b = scheduler.book(new BookingRequest(
            "R2-medium", slot(9, 0, 10, 0), alice, setOf(alice, bob), "Sprint planning"));
        System.out.println("Booked: " + b);
    }

    // 2) Overlap is rejected; a back-to-back [end == start) booking is allowed.
    private static void scenario2_conflictAndAdjacency(MeetingScheduler scheduler, Attendee alice, Attendee carol) {
        header("Scenario 2 — overlap rejected, adjacency allowed");
        try {
            scheduler.book(new BookingRequest(
                "R2-medium", slot(9, 30, 10, 30), carol, setOf(carol), "Overlapping standup"));
            System.out.println("ERROR: overlap should have been rejected!");
        } catch (BookingConflictException e) {
            System.out.println("Rejected overlap as expected: " + e.getMessage());
        }
        Booking adjacent = scheduler.book(new BookingRequest(
            "R2-medium", slot(10, 0, 11, 0), carol, setOf(carol, alice), "Back-to-back review"));
        System.out.println("Adjacent [10:00,11:00) accepted: " + adjacent.getId());
    }

    // 3) Cancel frees the slot; the same interval can then be re-booked.
    private static void scenario3_cancelFreesSlot(MeetingScheduler scheduler, Attendee alice, Attendee bob) {
        header("Scenario 3 — cancel frees the slot");
        Booking b = scheduler.book(new BookingRequest(
            "R1-small", slot(14, 0, 15, 0), alice, setOf(alice), "1:1"));
        System.out.println("Booked " + b.getId() + "; re-booking same slot should now fail...");
        try {
            scheduler.book(new BookingRequest("R1-small", slot(14, 0, 15, 0), bob, setOf(bob), "Clash"));
        } catch (BookingConflictException e) {
            System.out.println("  clash rejected (slot occupied)");
        }
        scheduler.cancel(b.getId());
        Booking rebooked = scheduler.book(new BookingRequest(
            "R1-small", slot(14, 0, 15, 0), bob, setOf(bob), "Reclaimed slot"));
        System.out.println("Re-booked after cancel: " + rebooked.getId());
    }

    // 4) find-available honours capacity; suggestSlot differs per strategy.
    private static void scenario4_findAndSuggest(MeetingScheduler scheduler,
                                                 Attendee alice, Attendee bob, Attendee carol) {
        header("Scenario 4 — find available rooms + strategy-driven suggestion");
        TimeInterval midday = slot(12, 0, 13, 0);
        List<Room> for5 = scheduler.findAvailableRooms(midday, 5);
        System.out.println("Rooms free 12:00-13:00 with capacity >= 5: " + roomIds(for5));
        List<Room> for16 = scheduler.findAvailableRooms(midday, 16);
        System.out.println("Rooms free 12:00-13:00 with capacity >= 16: " + roomIds(for16));

        TimeInterval window = new TimeInterval(DAY.atTime(9, 0), DAY.atTime(18, 0));
        Duration half = Duration.ofMinutes(30);

        scheduler.setAllocationStrategy(new FirstFitAllocation());
        Optional<RoomSlot> firstFit = scheduler.suggestSlot(window, half, 2);
        System.out.println("Suggestion [" + scheduler.getAllocationStrategy().name() + "]: " + firstFit.orElse(null));

        scheduler.setAllocationStrategy(new SmallestSufficientCapacityAllocation());
        Optional<RoomSlot> bestFit = scheduler.suggestSlot(window, half, 2);
        System.out.println("Suggestion [" + scheduler.getAllocationStrategy().name() + "]: " + bestFit.orElse(null));
        scheduler.setAllocationStrategy(new FirstFitAllocation()); // reset
    }

    // 5) Recurring meeting expands into concrete bookings (all-or-nothing).
    private static void scenario5_recurring(MeetingScheduler scheduler, Attendee carol) {
        header("Scenario 5 — recurring weekly meeting (x3), all-or-nothing");
        BookingRequest weekly = new BookingRequest(
            "R3-large", slot(16, 0, 17, 0), carol, setOf(carol), "Weekly all-hands");
        List<Booking> series = scheduler.bookRecurring(weekly, new RecurrenceRule(Frequency.WEEKLY, 3));
        System.out.println("Booked " + series.size() + " occurrences:");
        for (Booking b : series) {
            System.out.println("  " + b.getInterval());
        }
        System.out.println("R3-large schedule on " + DAY + ":");
        for (Booking b : scheduler.roomSchedule("R3-large", DAY)) {
            System.out.println("  " + b.getTitle() + " " + b.getInterval());
        }
    }

    // 6) N threads race for the SAME room+slot; exactly one may win.
    private static void scenario6_concurrencyRace() throws InterruptedException {
        header("Scenario 6 — concurrency: 50 threads race for one slot");
        final MeetingScheduler scheduler = new MeetingScheduler();
        scheduler.registerRoom(new Room("RACE", 10, "Floor 0"));
        final Attendee racer = new Attendee("r", "Racer", "race@corp.com");
        final TimeInterval slot = slot(11, 0, 12, 0);

        final int threads = 50;
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch done = new CountDownLatch(threads);
        final AtomicInteger wins = new AtomicInteger(0);
        final AtomicInteger rejects = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        scheduler.book(new BookingRequest("RACE", slot, racer, setOf(racer), "Contended"));
                        wins.incrementAndGet();
                    } catch (BookingConflictException e) {
                        rejects.incrementAndGet();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    done.countDown();
                }
            }).start();
        }
        start.countDown();
        done.await();
        System.out.println("winners = " + wins.get() + " (expected 1), rejected = " + rejects.get()
            + " (expected " + (threads - 1) + ")");
    }

    // ---- helpers ----

    private static TimeInterval slot(int h1, int m1, int h2, int m2) {
        return new TimeInterval(DAY.atTime(h1, m1), DAY.atTime(h2, m2));
    }

    private static Set<Attendee> setOf(Attendee... attendees) {
        Set<Attendee> s = new LinkedHashSet<Attendee>();
        for (Attendee a : attendees) {
            s.add(a);
        }
        return s;
    }

    private static String roomIds(List<Room> rooms) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < rooms.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append(rooms.get(i).getId());
        }
        return sb.append("]").toString();
    }

    private static void header(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }
}
