package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

/**
 * Email-based notification strategy.
 * In production, this would integrate with an email service (SendGrid, SES, etc.)
 */
public class EmailNotificationStrategy implements NotificationStrategy {
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Booking Confirmed - #" + booking.getId());
        System.out.println("   Body: Your booking for " + booking.getSeats().size() 
            + " seats has been confirmed.");
        System.out.println("   Amount: ₹" + booking.getTotalAmount());
        System.out.println("   Show ID: " + booking.getShowId());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Booking Cancelled - #" + booking.getId());
        System.out.println("   Body: Your booking has been cancelled successfully.");
        System.out.println("   Refund Amount: ₹" + booking.getTotalAmount());
        System.out.println("───────────────────────────────────────");
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        System.out.println("📧 EMAIL SENT TO: " + user.getEmail());
        System.out.println("   Subject: Show Reminder - #" + booking.getId());
        System.out.println("   Body: Your show is starting soon!");
        System.out.println("   Please arrive 15 minutes early.");
        System.out.println("───────────────────────────────────────");
    }
}
