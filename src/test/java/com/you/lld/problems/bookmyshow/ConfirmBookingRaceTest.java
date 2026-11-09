package com.you.lld.problems.bookmyshow;

import com.you.lld.problems.bookmyshow.exceptions.SeatNotAvailableException;
import com.you.lld.problems.bookmyshow.impl.EmailNotificationStrategy;
import com.you.lld.problems.bookmyshow.impl.EnhancedBookingService;
import com.you.lld.problems.bookmyshow.impl.SimplePricingStrategy;
import com.you.lld.problems.bookmyshow.model.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Currency;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ConfirmBookingRaceTest {

    private static final String SHOW = "SH1";
    private static final List<String> SEAT = Collections.singletonList("SEAT_A1");

    private EnhancedBookingService service;

    @BeforeEach
    void setUp() {
        service = new EnhancedBookingService(
            new SimplePricingStrategy(Currency.getInstance("INR")), new EmailNotificationStrategy());
        service.addMovie(new Movie("M1", "Movie", "desc", Duration.ofMinutes(120),
            Language.ENGLISH, Genre.ACTION, new ArrayList<String>(), 8.0));
        service.addTheater(new Theater("T1", "Theater", "Address", City.MUMBAI));
        Screen screen = new Screen("S1", "T1", "Screen 1", 1);
        List<Seat> seats = new ArrayList<Seat>();
        seats.add(new Seat("SEAT_A1", "A1", SeatType.REGULAR, 150.0));
        screen.setSeats(seats);
        service.addScreen(screen);
        service.addShow(new Show(SHOW, "M1", "S1",
            LocalDateTime.now().plusHours(3), LocalDateTime.now().plusHours(5)));
        service.addUser(new User("A", "Alice", "a@x.com", "1"));
        service.addUser(new User("B", "Bob", "b@x.com", "2"));
    }

    @AfterEach
    void tearDown() {
        service.shutdown();
    }

    @Test
    void confirmFailsWhenCallerNoLongerHoldsTheSeatLock() {
        assertTrue(service.lockSeats(SHOW, SEAT, "A"));
        Booking aliceBooking = service.createBooking("A", SHOW, SEAT);

        // Alice's hold lapses (same effect as the 5-minute expiry), Bob takes the seat.
        service.unlockSeats(SHOW, SEAT, "A");
        assertTrue(service.lockSeats(SHOW, SEAT, "B"));
        Booking bobBooking = service.createBooking("B", SHOW, SEAT);
        assertTrue(service.confirmBooking(bobBooking.getId(), paidFor(bobBooking)));

        assertThrows(SeatNotAvailableException.class,
            () -> service.confirmBooking(aliceBooking.getId(), paidFor(aliceBooking)));
        assertNotEquals(BookingStatus.CONFIRMED, aliceBooking.getStatus());
    }

    private static Payment paidFor(Booking booking) {
        Payment p = new Payment("P-" + booking.getId(), booking.getId(), booking.getTotalAmount(),
            PaymentMethod.CREDIT_CARD, LocalDateTime.now());
        p.setStatus(PaymentStatus.SUCCESS);
        return p;
    }
}
