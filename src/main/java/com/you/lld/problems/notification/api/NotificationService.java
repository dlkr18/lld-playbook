package com.you.lld.problems.notification.api;

import com.you.lld.problems.notification.model.*;

public interface NotificationService {
    String sendNotification(String userId, String message, 
                          NotificationChannel channel, Priority priority);
    Notification getNotificationStatus(String notificationId);
    void retryFailed();
}
