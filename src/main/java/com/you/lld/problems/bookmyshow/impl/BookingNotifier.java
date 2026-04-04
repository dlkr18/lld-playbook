package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.BookingObserver;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Observer that bridges Booking state changes → NotificationStrategy delivery.
 *
 * Keeps Booking and User entities pure (no notification logic in entities -- SRP).
 * One BookingNotifier per booking, registered in the service when the booking is created.
 *
 * On each state change, inspects booking.getStatus() and routes to the appropriate
 * NotificationStrategy method for rich per-event formatting.
 */
public class BookingNotifier implements BookingObserver {

    private final User user;
    private final NotificationStrategy notificationStrategy;

    public BookingNotifier(User user, NotificationStrategy notificationStrategy) {
        this.user = user;
        this.notificationStrategy = notificationStrategy;
    }

    @Override
    public void update(Booking booking) {
        switch (booking.getStatus()) {
            case CONFIRMED:
                notificationStrategy.notifyBookingConfirmed(user, booking);
                break;
            case CANCELLED:
                notificationStrategy.notifyBookingCancelled(user, booking);
                break;
            case EXPIRED:
                notificationStrategy.notifyBookingCancelled(user, booking);
                break;
            default:
                break;
        }
    }
}
