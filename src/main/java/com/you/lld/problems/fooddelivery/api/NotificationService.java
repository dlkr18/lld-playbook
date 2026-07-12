package com.you.lld.problems.fooddelivery.api;

/**
 * Delivery channel for notifications.
 * Implementations: console, SMS, push, email, etc.
 */
public interface NotificationService {
    void notify(String recipientId, String message);
}
