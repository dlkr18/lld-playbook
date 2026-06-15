package com.you.lld.problems.notification.service;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    String send(String userId, String message, NotificationChannel channel, Priority priority);

    String sendTemplated(String userId, String templateId, Map<String, String> variables,
                         NotificationChannel channel, Priority priority);

    List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                  Priority priority);

    Notification getStatus(String notificationId);

    void retryFailed();

    void shutdown();
}
