package com.you.lld.problems.meetingscheduler;

import com.you.lld.problems.meetingscheduler.exception.BookingConflictException;
import com.you.lld.problems.meetingscheduler.exception.BookingNotFoundException;
import com.you.lld.problems.meetingscheduler.exception.NoRoomAvailableException;
import com.you.lld.problems.meetingscheduler.exception.RoomNotFoundException;
import com.you.lld.problems.meetingscheduler.model.Booking;
import com.you.lld.problems.meetingscheduler.model.BookingRequest;
import com.you.lld.problems.meetingscheduler.model.RecurrenceRule;
import com.you.lld.problems.meetingscheduler.model.Room;
import com.you.lld.problems.meetingscheduler.model.RoomSlot;
import com.you.lld.problems.meetingscheduler.model.TimeInterval;
import com.you.lld.problems.meetingscheduler.service.AllocationStrategy;
import com.you.lld.problems.meetingscheduler.service.BookingObserver;
import com.you.lld.problems.meetingscheduler.service.RoomCalendar;
import com.you.lld.problems.meetingscheduler.service.impl.FirstFitAllocation;
import com.you.lld.problems.meetingscheduler.service.impl.TreeMapRoomCalendar;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Facade / orchestrator — the single object an interviewer sees first. Owns the
 * room registry, one {@link RoomCalendar} per room, the per-room lock table, the
 * pluggable {@link AllocationStrategy}, and the list of {@link BookingObserver}s.
 *
 * <h3>Concurrency model (stated explicitly)</h3>
 * <ul>
 *   <li>Registry maps ({@code rooms}, {@code calendars}, {@code roomLocks},
 *       {@code bookingsById}) are {@link ConcurrentHashMap} — safe concurrent
 *       structural access.</li>
 *   <li>The invariant "no two overlapping bookings in one room" is protected by a
 *       <b>per-room {@link ReentrantLock}</b>. The whole
 *       <i>check-freeness → insert</i> critical section runs under that lock, so
 *       two threads racing for the same room+slot are serialised and exactly one
 *       wins.</li>
 *   <li>The lock is <b>per room</b>, not global: bookings in different rooms
 *       proceed fully in parallel.</li>
 *   <li>Observers are notified AFTER the mutation commits and OUTSIDE the lock,
 *       so a slow observer never widens the critical section.</li>
 * </ul>
 */
public class MeetingScheduler {

    private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<String, Room>();
    private final ConcurrentMap<String, RoomCalendar> calendars = new ConcurrentHashMap<String, RoomCalendar>();
    private final ConcurrentMap<String, ReentrantLock> roomLocks = new ConcurrentHashMap<String, ReentrantLock>();
    private final ConcurrentMap<String, Booking> bookingsById = new ConcurrentHashMap<String, Booking>();
    private final CopyOnWriteArrayList<BookingObserver> observers = new CopyOnWriteArrayList<BookingObserver>();

    private final AtomicLong bookingSeq = new AtomicLong(0);

    // Strategy pattern: hot-swappable allocation policy. volatile => safe publication.
    private volatile AllocationStrategy allocationStrategy = new FirstFitAllocation();

    // ---------------------------------------------------------------- config

    public void registerRoom(Room room) {
        if (room == null) {
            throw new IllegalArgumentException("room must not be null");
        }
        if (rooms.putIfAbsent(room.getId(), room) != null) {
            throw new IllegalArgumentException("room id already registered: " + room.getId());
        }
        calendars.put(room.getId(), new TreeMapRoomCalendar());
        roomLocks.put(room.getId(), new ReentrantLock());
    }

    public void setAllocationStrategy(AllocationStrategy strategy) {
        if (strategy == null) {
            throw new IllegalArgumentException("strategy must not be null");
        }
        this.allocationStrategy = strategy;
    }

    public AllocationStrategy getAllocationStrategy() {
        return allocationStrategy;
    }

    public void addObserver(BookingObserver observer) {
        if (observer == null) {
            throw new IllegalArgumentException("observer must not be null");
        }
        observers.add(observer);
    }

    // ---------------------------------------------------------------- booking

    /**
     * Book a specific room ({@code request.getRoomId()} must be set).
     *
     * @throws BookingConflictException if the interval overlaps an existing booking.
     */
    public Booking book(BookingRequest request) {
        if (request.getRoomId() == null) {
            throw new IllegalArgumentException("book(): request must name a roomId; use bookAny() otherwise");
        }
        Room room = roomOrThrow(request.getRoomId());
        Booking booking = toBooking(room, request);

        ReentrantLock lock = roomLocks.get(room.getId());
        lock.lock();
        try {
            // check-then-insert is atomic under the per-room lock
            calendars.get(room.getId()).book(booking);
            bookingsById.put(booking.getId(), booking);
        } finally {
            lock.unlock();
        }

        notifyBooked(booking); // outside the lock
        return booking;
    }

    /**
     * Book <i>some</i> room that is free for {@code request}'s interval and holds
     * at least {@code minCapacity} people (and everyone invited). The active
     * {@link AllocationStrategy} decides which. Re-checks under the room lock and
     * falls through to the next candidate if a race stole the chosen room.
     */
    public Booking bookAny(BookingRequest request, int minCapacity) {
        int needed = Math.max(minCapacity, request.headcount());
        TimeInterval interval = request.getInterval();

        List<RoomSlot> candidates = new ArrayList<RoomSlot>();
        for (Room room : rooms.values()) {
            if (room.getCapacity() < needed) {
                continue;
            }
            if (isFreeUnderLock(room.getId(), interval)) {
                candidates.add(new RoomSlot(room, interval));
            }
        }
        sortCandidates(candidates);

        // Strategy chooses; retry down the ranked list if a concurrent booking
        // grabbed the winner between the availability scan and our lock.
        List<RoomSlot> remaining = new ArrayList<RoomSlot>(candidates);
        while (!remaining.isEmpty()) {
            Optional<RoomSlot> chosen = allocationStrategy.select(remaining);
            if (!chosen.isPresent()) {
                break;
            }
            RoomSlot pick = chosen.get();
            BookingRequest targeted = new BookingRequest(pick.getRoom().getId(), interval,
                request.getOrganizer(), request.getAttendees(), request.getTitle());
            try {
                return book(targeted);
            } catch (BookingConflictException raceLost) {
                remaining.remove(pick); // lost the race for this room; try the next best
            }
        }
        throw new NoRoomAvailableException(
            "no room with capacity >= " + needed + " free for " + interval);
    }

    /**
     * Book a recurring meeting in one specific room, all-or-nothing. Expands the
     * rule into concrete occurrences, then under a SINGLE hold of the room lock
     * verifies every occurrence is free and inserts them all. If any occurrence
     * conflicts, nothing is booked.
     */
    public List<Booking> bookRecurring(BookingRequest request, RecurrenceRule rule) {
        if (request.getRoomId() == null) {
            throw new IllegalArgumentException("bookRecurring(): request must name a roomId");
        }
        Room room = roomOrThrow(request.getRoomId());
        Duration duration = request.getInterval().getDuration();
        LocalDateTime firstStart = request.getInterval().getStart();

        List<Booking> toInsert = new ArrayList<Booking>();
        for (int i = 0; i < rule.getOccurrences(); i++) {
            LocalDateTime start = firstStart.plus((long) i * rule.getFrequency().getStep(),
                rule.getFrequency().getUnit());
            TimeInterval occInterval = TimeInterval.of(start, duration);
            toInsert.add(toBooking(room, request.withInterval(occInterval)));
        }

        ReentrantLock lock = roomLocks.get(room.getId());
        RoomCalendar calendar = calendars.get(room.getId());
        lock.lock();
        try {
            for (Booking b : toInsert) {
                if (!calendar.isFree(b.getInterval())) {
                    throw new BookingConflictException(
                        "recurring occurrence " + b.getInterval() + " conflicts; nothing booked");
                }
            }
            for (Booking b : toInsert) {
                calendar.book(b);
                bookingsById.put(b.getId(), b);
            }
        } finally {
            lock.unlock();
        }

        for (Booking b : toInsert) {
            notifyBooked(b);
        }
        return toInsert;
    }

    /** Cancel a confirmed booking, freeing its slot. */
    public Booking cancel(String bookingId) {
        Booking existing = bookingsById.get(bookingId);
        if (existing == null) {
            throw new BookingNotFoundException(bookingId);
        }
        Booking cancelled = existing.cancelled();

        ReentrantLock lock = roomLocks.get(existing.getRoom().getId());
        lock.lock();
        try {
            calendars.get(existing.getRoom().getId()).cancel(existing);
            bookingsById.put(bookingId, cancelled); // keep record, mark CANCELLED
        } finally {
            lock.unlock();
        }

        notifyCancelled(cancelled); // outside the lock
        return cancelled;
    }

    // ---------------------------------------------------------------- queries

    /** All rooms with capacity >= minCapacity that are free for the whole interval, ordered by id. */
    public List<Room> findAvailableRooms(TimeInterval interval, int minCapacity) {
        List<Room> available = new ArrayList<Room>();
        for (Room room : rooms.values()) {
            if (room.getCapacity() >= minCapacity && isFreeUnderLock(room.getId(), interval)) {
                available.add(room);
            }
        }
        Collections.sort(available, new Comparator<Room>() {
            @Override
            public int compare(Room a, Room b) {
                return a.getId().compareTo(b.getId());
            }
        });
        return available;
    }

    /**
     * Suggest the earliest (room, slot) of {@code duration} within {@code window}
     * across all rooms of at least {@code minCapacity}, chosen by the active
     * strategy. Does NOT book.
     */
    public Optional<RoomSlot> suggestSlot(TimeInterval window, Duration duration, int minCapacity) {
        List<RoomSlot> candidates = new ArrayList<RoomSlot>();
        for (Room room : rooms.values()) {
            if (room.getCapacity() < minCapacity) {
                continue;
            }
            Optional<TimeInterval> slot = earliestFreeSlotUnderLock(room.getId(), window, duration);
            if (slot.isPresent()) {
                candidates.add(new RoomSlot(room, slot.get()));
            }
        }
        sortCandidates(candidates);
        return allocationStrategy.select(candidates);
    }

    public List<Booking> roomSchedule(String roomId, LocalDate day) {
        roomOrThrow(roomId);
        ReentrantLock lock = roomLocks.get(roomId);
        lock.lock();
        try {
            return calendars.get(roomId).scheduleFor(day);
        } finally {
            lock.unlock();
        }
    }

    public Optional<Booking> getBooking(String bookingId) {
        return Optional.ofNullable(bookingsById.get(bookingId));
    }

    public List<Room> getRooms() {
        return new ArrayList<Room>(rooms.values());
    }

    // ---------------------------------------------------------------- helpers

    private Room roomOrThrow(String roomId) {
        Room room = rooms.get(roomId);
        if (room == null) {
            throw new RoomNotFoundException(roomId);
        }
        return room;
    }

    private Booking toBooking(Room room, BookingRequest request) {
        String id = "BK-" + bookingSeq.incrementAndGet();
        return new Booking(id, room, request.getInterval(), request.getOrganizer(),
            request.getAttendees(), request.getTitle());
    }

    private boolean isFreeUnderLock(String roomId, TimeInterval interval) {
        ReentrantLock lock = roomLocks.get(roomId);
        lock.lock();
        try {
            return calendars.get(roomId).isFree(interval);
        } finally {
            lock.unlock();
        }
    }

    private Optional<TimeInterval> earliestFreeSlotUnderLock(String roomId, TimeInterval window, Duration duration) {
        ReentrantLock lock = roomLocks.get(roomId);
        lock.lock();
        try {
            return calendars.get(roomId).earliestFreeSlot(window, duration);
        } finally {
            lock.unlock();
        }
    }

    private void sortCandidates(List<RoomSlot> candidates) {
        Collections.sort(candidates, new Comparator<RoomSlot>() {
            @Override
            public int compare(RoomSlot a, RoomSlot b) {
                int startCmp = a.getSlot().getStart().compareTo(b.getSlot().getStart());
                if (startCmp != 0) {
                    return startCmp;
                }
                return a.getRoom().getId().compareTo(b.getRoom().getId());
            }
        });
    }

    private void notifyBooked(Booking booking) {
        for (BookingObserver observer : observers) {
            observer.onBooked(booking);
        }
    }

    private void notifyCancelled(Booking booking) {
        for (BookingObserver observer : observers) {
            observer.onCancelled(booking);
        }
    }
}
