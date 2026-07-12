package com.you.lld.problems.bookmyshow.impl;

import com.you.lld.problems.bookmyshow.api.NotificationStrategy;
import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Composite notification strategy that sends notifications through multiple channels.
 * Demonstrates Composite pattern for notifications.
 */
public class MultiChannelNotificationStrategy implements NotificationStrategy {
    
    private final List<NotificationStrategy> strategies;
    
    public MultiChannelNotificationStrategy() {
        this.strategies = new ArrayList<>();
    }
    
    public void addChannel(NotificationStrategy strategy) {
        strategies.add(strategy);
    }
    
    @Override
    public void notifyBookingConfirmed(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingConfirmed(user, booking);
        }
    }
    
    @Override
    public void notifyBookingCancelled(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingCancelled(user, booking);
        }
    }
    
    @Override
    public void notifyBookingReminder(User user, Booking booking) {
        for (NotificationStrategy strategy : strategies) {
            strategy.notifyBookingReminder(user, booking);
        }
    }
}
