package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class PushChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public PushChannelSender() {
        this(0.03);
    }

    public PushChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.PUSH;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(20);
        if (Math.random() < failureRate) {
            throw new RuntimeException("Push token expired");
        }
        System.out.println("  PUSH -> " + userId + ": " + payload);
    }
}
