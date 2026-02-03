package com.you.lld.problems.bookmyshow.api;

import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Strategy interface for sending notifications to users.
 * Allows different notification channels: email, SMS, push, etc.
 */
public interface NotificationStrategy {
    
    /**
     * Send booking confirmation notification.
     * @param user The user to notify
     * @param booking The confirmed booking
     */
    void notifyBookingConfirmed(User user, Booking booking);
    
    /**
     * Send booking cancellation notification.
     * @param user The user to notify
     * @param booking The cancelled booking
     */
    void notifyBookingCancelled(User user, Booking booking);
    
    /**
     * Send booking reminder notification (e.g., 1 hour before show).
     * @param user The user to notify
     * @param booking The upcoming booking
     */
    void notifyBookingReminder(User user, Booking booking);
}
