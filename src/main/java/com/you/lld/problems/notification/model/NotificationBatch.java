package com.you.lld.problems.notification.model;

import java.util.*;

public class NotificationBatch {
    private final String id;
    private final List<Notification> notifications;
    private final String batchType;
    
    public NotificationBatch(String id, String batchType) {
        this.id = id;
        this.batchType = batchType;
        this.notifications = new ArrayList<>();
    }
    
    public void addNotification(Notification notification) {
        notifications.add(notification);
    }
    
    public List<Notification> getNotifications() {
        return new ArrayList<>(notifications);
    }
    
    public int size() {
        return notifications.size();
    }
}
