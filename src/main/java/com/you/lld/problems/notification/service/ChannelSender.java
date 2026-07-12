package com.you.lld.problems.notification.service;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;

public interface ChannelSender {

    NotificationChannel channel();

    void send(Notification notification) throws Exception;
}
