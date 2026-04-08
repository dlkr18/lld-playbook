package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.NotificationService;

public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String recipientId, String message) {
        System.out.println("[NOTIFY -> " + recipientId + "] " + message);
    }
}
