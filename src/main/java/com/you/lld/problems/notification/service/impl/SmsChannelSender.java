package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class SmsChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public SmsChannelSender() {
        this(0.08);
    }

    public SmsChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.SMS;
    }

    @Override
    protected String formatMessage(com.you.lld.problems.notification.model.Notification notification) {
        String body = notification.getMessage();
        if (body.length() > 160) {
            body = body.substring(0, 157) + "...";
        }
        return body;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(30);
        if (Math.random() < failureRate) {
            throw new RuntimeException("SMS carrier timeout");
        }
        System.out.println("  SMS -> " + userId + ": " + payload);
    }
}
