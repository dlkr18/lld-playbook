package com.you.lld.problems.meetingscheduler;

import com.you.lld.problems.meetingscheduler.exception.BookingConflictException;
import com.you.lld.problems.meetingscheduler.exception.BookingNotFoundException;
import com.you.lld.problems.meetingscheduler.exception.NoRoomAvailableException;
import com.you.lld.problems.meetingscheduler.model.Attendee;
import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.model.BookingRequest;
import com.you.lld.problems.meetingscheduler.model.BookingStatus;
import com.you.lld.problems.meetingscheduler.model.Frequency;
import com.you.lld.problems.meetingscheduler.model.RecurrenceRule;
import com.you.lld.problems.meetingscheduler.model.Room;
import com.you.lld.problems.meetingscheduler.model.RoomSlot;
import com.you.lld.problems.meetingscheduler.model.TimeInterval;
import com.you.lld.problems.meetingscheduler.service.impl.SmallestSufficientCapacityAllocation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Meeting Scheduler Tests")
class MeetingSchedulerTest {

    private static final LocalDate DAY = LocalDate.of(2026, 7, 13);

    private MeetingScheduler scheduler;
    private Attendee alice;
    private Attendee bob;

    @BeforeEach
    void setUp() {
        scheduler = new MeetingScheduler();
        scheduler.registerRoom(new Room("R1", 4, "F1"));
        scheduler.registerRoom(new Room("R2", 10, "F2"));
        scheduler.registerRoom(new Room("R3", 20, "F3"));
        alice = new Attendee("u1", "Alice", "alice@corp.com");
        bob = new Attendee("u2", "Bob", "bob@corp.com");
    }

    private TimeInterval slot(int h1, int m1, int h2, int m2) {
        return new TimeInterval(DAY.atTime(h1, m1), DAY.atTime(h2, m2));
    }

    private Set<Attendee> setOf(Attendee... attendees) {
        Set<Attendee> s = new LinkedHashSet<Attendee>();
        for (Attendee a : attendees) {
            s.add(a);
        }
        return s;
    }

    private BookingRequest req(String roomId, TimeInterval interval, String title) {
        return new BookingRequest(roomId, interval, alice, setOf(alice, bob), title);
    }

    @Nested
    @DisplayName("Booking")
    class Booking_ {

        @Test
        @DisplayName("Should book a free room and return a CONFIRMED booking")
        void shouldBookFreeRoom() {
            Booking b = scheduler.book(req("R1", slot(9, 0, 10, 0), "standup"));
            assertNotNull(b.getId());
            assertEquals(BookingStatus.CONFIRMED, b.getStatus());
            assertEquals("R1", b.getRoom().getId());
            assertTrue(scheduler.getBooking(b.getId()).isPresent());
        }

        @Test
        @DisplayName("Should reject an overlapping booking in the same room")
        void shouldRejectOverlap() {
            scheduler.book(req("R1", slot(9, 0, 10, 0), "first"));
            assertThrows(BookingConflictException.class,
                () -> scheduler.book(req("R1", slot(9, 30, 10, 30), "overlap")));
        }

        @Test
        @DisplayName("Should allow adjacent booking where end == start (half-open)")
        void shouldAllowAdjacent() {
            scheduler.book(req("R1", slot(9, 0, 10, 0), "first"));
            Booking adjacent = scheduler.book(req("R1", slot(10, 0, 11, 0), "adjacent"));
            assertEquals(BookingStatus.CONFIRMED, adjacent.getStatus());
        }

        @Test
        @DisplayName("Should allow the same interval in a different room")
        void shouldAllowSameSlotDifferentRoom() {
            scheduler.book(req("R1", slot(9, 0, 10, 0), "in R1"));
            Booking b2 = scheduler.book(req("R2", slot(9, 0, 10, 0), "in R2"));
            assertEquals("R2", b2.getRoom().getId());
        }

        @Test
        @DisplayName("Should reject attendee count exceeding room capacity")
        void shouldRejectOverCapacity() {
            Attendee c = new Attendee("u3", "Carol", "c@corp.com");
            Attendee d = new Attendee("u4", "Dan", "d@corp.com");
            Attendee e = new Attendee("u5", "Eve", "e@corp.com");
            // R1 capacity 4; organizer alice + bob + 3 more = 5 people
            BookingRequest tooMany = new BookingRequest(
                "R1", slot(9, 0, 10, 0), alice, setOf(bob, c, d, e), "packed");
            assertThrows(IllegalArgumentException.class, () -> scheduler.book(tooMany));
        }
    }

    @Nested
    @DisplayName("Cancellation")
    class Cancellation {

        @Test
        @DisplayName("Cancel should free the slot for re-booking")
        void cancelFreesSlot() {
            Booking b = scheduler.book(req("R1", slot(9, 0, 10, 0), "first"));
            // occupied
            assertThrows(BookingConflictException.class,
                () -> scheduler.book(req("R1", slot(9, 0, 10, 0), "clash")));

            Booking cancelled = scheduler.cancel(b.getId());
            assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());

            // slot is now free again
            Booking rebooked = scheduler.book(req("R1", slot(9, 0, 10, 0), "rebooked"));
            assertEquals(BookingStatus.CONFIRMED, rebooked.getStatus());
            assertNotEquals(b.getId(), rebooked.getId());
        }

        @Test
        @DisplayName("Cancelling an unknown booking id should throw")
        void cancelUnknownThrows() {
            assertThrows(BookingNotFoundException.class, () -> scheduler.cancel("nope"));
        }
    }

    @Nested
    @DisplayName("Queries")
    class Queries {

        @Test
        @DisplayName("findAvailableRooms should honour minimum capacity")
        void findAvailableHonoursCapacity() {
            TimeInterval s = slot(12, 0, 13, 0);
            // all three rooms free at midday
            assertEquals(3, scheduler.findAvailableRooms(s, 1).size());
            // only R2(10) and R3(20) hold >= 5
            List<Room> for5 = scheduler.findAvailableRooms(s, 5);
            assertEquals(2, for5.size());
            // only R3(20) holds >= 16
            List<Room> for16 = scheduler.findAvailableRooms(s, 16);
            assertEquals(1, for16.size());
            assertEquals("R3", for16.get(0).getId());
        }

        @Test
        @DisplayName("findAvailableRooms should exclude a room booked for the interval")
        void findAvailableExcludesBooked() {
            scheduler.book(req("R2", slot(12, 0, 13, 0), "busy"));
            List<Room> free = scheduler.findAvailableRooms(slot(12, 0, 13, 0), 5);
            assertEquals(1, free.size());
            assertEquals("R3", free.get(0).getId());
        }

        @Test
        @DisplayName("suggestSlot should find the earliest gap of the requested duration")
        void suggestFindsEarliestGap() {
            // Fill R3 (best-fit target excluded via capacity below) is irrelevant here;
            // pin every room's early morning so the first free 30-min gap is at 09:30.
            for (Room r : scheduler.getRooms()) {
                scheduler.book(new BookingRequest(r.getId(), slot(9, 0, 9, 30), alice, setOf(alice), "block " + r.getId()));
            }
            TimeInterval window = new TimeInterval(DAY.atTime(9, 0), DAY.atTime(18, 0));
            Optional<RoomSlot> suggestion = scheduler.suggestSlot(window, Duration.ofMinutes(30), 1);
            assertTrue(suggestion.isPresent());
            assertEquals(DAY.atTime(9, 30), suggestion.get().getSlot().getStart());
            assertEquals(DAY.atTime(10, 0), suggestion.get().getSlot().getEnd());
        }

        @Test
        @DisplayName("SmallestSufficientCapacity strategy should prefer the smallest fitting room")
        void bestFitPrefersSmallestRoom() {
            scheduler.setAllocationStrategy(new SmallestSufficientCapacityAllocation());
            TimeInterval window = new TimeInterval(DAY.atTime(9, 0), DAY.atTime(18, 0));
            // capacity >= 5 => R2(10) and R3(20) qualify; best-fit picks R2.
            Optional<RoomSlot> suggestion = scheduler.suggestSlot(window, Duration.ofMinutes(60), 5);
            assertTrue(suggestion.isPresent());
            assertEquals("R2", suggestion.get().getRoom().getId());
        }

        @Test
        @DisplayName("roomSchedule should return the day's bookings ordered by start")
        void roomScheduleOrdered() {
            scheduler.book(req("R1", slot(15, 0, 16, 0), "afternoon"));
            scheduler.book(req("R1", slot(9, 0, 10, 0), "morning"));
            List<Booking> day = scheduler.roomSchedule("R1", DAY);
            assertEquals(2, day.size());
            assertEquals("morning", day.get(0).getTitle());
            assertEquals("afternoon", day.get(1).getTitle());
        }
    }

    @Nested
    @DisplayName("Recurrence")
    class Recurrence {

        @Test
        @DisplayName("bookRecurring should expand into concrete weekly occurrences")
        void recurringExpands() {
            List<Booking> series = scheduler.bookRecurring(
                req("R3", slot(16, 0, 17, 0), "weekly"), new RecurrenceRule(Frequency.WEEKLY, 3));
            assertEquals(3, series.size());
            assertEquals(DAY.atTime(16, 0), series.get(0).getInterval().getStart());
            assertEquals(DAY.plusWeeks(1).atTime(16, 0), series.get(1).getInterval().getStart());
            assertEquals(DAY.plusWeeks(2).atTime(16, 0), series.get(2).getInterval().getStart());
        }

        @Test
        @DisplayName("bookRecurring should be all-or-nothing when an occurrence conflicts")
        void recurringAllOrNothing() {
            // Pre-book the 2nd daily occurrence (day+1) so the 3-day series must fail atomically.
            scheduler.book(req("R3", new TimeInterval(DAY.plusDays(1).atTime(16, 0), DAY.plusDays(1).atTime(17, 0)), "blocker"));
            assertThrows(BookingConflictException.class, () -> scheduler.bookRecurring(
                req("R3", slot(16, 0, 17, 0), "daily"), new RecurrenceRule(Frequency.DAILY, 3)));
            // All-or-nothing: the day-0 occurrence must NOT have been booked.
            assertTrue(scheduler.roomSchedule("R3", DAY).isEmpty());
        }
    }

    @Nested
    @DisplayName("Concurrency")
    class Concurrency {

        @Test
        @DisplayName("N threads racing for the same room+slot -> exactly one wins")
        void exactlyOneWinnerUnderRace() throws InterruptedException {
            final int threads = 64;
            final ExecutorService pool = Executors.newFixedThreadPool(threads);
            final CountDownLatch startGate = new CountDownLatch(1);
            final CountDownLatch finished = new CountDownLatch(threads);
            final AtomicInteger wins = new AtomicInteger(0);
            final AtomicInteger conflicts = new AtomicInteger(0);
            final TimeInterval contended = slot(11, 0, 12, 0);

            for (int i = 0; i < threads; i++) {
                pool.execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            startGate.await();
                            scheduler.book(new BookingRequest("R2", contended, alice, setOf(alice), "contended"));
                            wins.incrementAndGet();
                        } catch (BookingConflictException e) {
                            conflicts.incrementAndGet();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        } finally {
                            finished.countDown();
                        }
                    }
                });
            }

            startGate.countDown();
            assertTrue(finished.await(10, TimeUnit.SECONDS), "threads did not finish in time");
            pool.shutdownNow();

            assertEquals(1, wins.get(), "exactly one booking must succeed");
            assertEquals(threads - 1, conflicts.get(), "all others must be rejected");
            assertEquals(1, scheduler.roomSchedule("R2", DAY).size(), "calendar holds a single booking");
        }

        @Test
        @DisplayName("Bookings in different rooms proceed in parallel without conflict")
        void differentRoomsNoConflict() throws InterruptedException {
            final TimeInterval sameSlot = slot(13, 0, 14, 0);
            final String[] roomIds = {"R1", "R2", "R3"};
            final CountDownLatch finished = new CountDownLatch(roomIds.length);
            final AtomicInteger wins = new AtomicInteger(0);
            for (final String roomId : roomIds) {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        scheduler.book(new BookingRequest(roomId, sameSlot, alice, setOf(alice), "parallel"));
                        wins.incrementAndGet();
                        finished.countDown();
                    }
                }).start();
            }
            assertTrue(finished.await(10, TimeUnit.SECONDS));
            assertEquals(3, wins.get());
        }
    }

    @Nested
    @DisplayName("bookAny + allocation")
    class BookAny {

        @Test
        @DisplayName("bookAny should pick a free room satisfying capacity")
        void bookAnyPicksRoom() {
            Booking b = scheduler.bookAny(
                new BookingRequest(null, slot(9, 0, 10, 0), alice, setOf(alice), "any"), 5);
            assertTrue(b.getRoom().getCapacity() >= 5);
            assertEquals(BookingStatus.CONFIRMED, b.getStatus());
        }

        @Test
        @DisplayName("bookAny should throw when no room satisfies the request")
        void bookAnyThrowsWhenNone() {
            assertThrows(NoRoomAvailableException.class, () -> scheduler.bookAny(
                new BookingRequest(null, slot(9, 0, 10, 0), alice, setOf(alice), "huge"), 100));
        }
    }
}
