package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;

public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String userId, String message) {
        System.out.println("[NOTIFY -> " + userId + "] " + message);
    }
}
