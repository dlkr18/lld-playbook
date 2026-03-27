package com.you.lld.problems.ridehailing.api;

/**
 * Observer interface for ride events (driver accepted, trip started, payment, etc.).
 * Implementations can send push notifications, SMS, or log to console.
 */
public interface NotificationService {
    void notify(String userId, String message);
}
