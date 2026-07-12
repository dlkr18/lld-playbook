package com.you.lld.problems.library.impl;

import com.you.lld.problems.library.api.NotificationService;

/**
 * Simple notification implementation that prints to stdout.
 * Swappable with EmailNotificationService, SMSNotificationService, etc.
 */
public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String memberId, String message) {
        System.out.println("[NOTIFY -> " + memberId + "] " + message);
    }
}
