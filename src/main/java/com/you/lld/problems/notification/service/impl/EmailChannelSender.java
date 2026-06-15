package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class EmailChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public EmailChannelSender() {
        this(0.05);
    }

    public EmailChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.EMAIL;
    }

    @Override
    protected String formatMessage(com.you.lld.problems.notification.model.Notification notification) {
        return "[EMAIL] Subject: Notification\n" + notification.getMessage();
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(50);
        if (Math.random() < failureRate) {
            throw new RuntimeException("SMTP gateway unavailable");
        }
        System.out.println("  EMAIL -> " + userId + ": " + payload);
    }
}
