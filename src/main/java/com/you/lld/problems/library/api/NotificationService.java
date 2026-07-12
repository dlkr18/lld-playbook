package com.you.lld.problems.library.api;

/**
 * Observer interface for library events (reservation available, fine charged, etc.).
 * Implementations can send email, SMS, push notifications, or just log to console.
 */
public interface NotificationService {
    void notify(String memberId, String message);
}
