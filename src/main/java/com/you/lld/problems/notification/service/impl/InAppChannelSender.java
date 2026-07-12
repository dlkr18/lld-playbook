package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class InAppChannelSender extends AbstractChannelSender {

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.IN_APP;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        System.out.println("  IN_APP -> " + userId + ": " + payload);
    }
}
