package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * SMS-based notification strategy.
 * In production, this would integrate with an SMS gateway (Twilio, SNS, etc.)
 */
public class SMSNotificationStrategy implements NotificationStrategy {
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Booking #" + booking.getId() + " confirmed!");
        System.out.println("   Seats: " + booking.getSeats().size() 
            + " | Amount: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Booking #" + booking.getId() + " cancelled.");
        System.out.println("   Refund: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        System.out.println("📱 SMS SENT TO: " + user.getPhone());
        System.out.println("   Msg: Your show is starting soon! #" + booking.getId());
        System.out.println("───────────────────────────────────────");
    }
}
