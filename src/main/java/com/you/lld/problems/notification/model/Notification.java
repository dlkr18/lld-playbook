package com.you.lld.problems.notification.model;

import java.time.LocalDateTime;

public class Notification {
    private final String id;
    private final String userId;
    private final String message;
    private final NotificationChannel channel;
    private final Priority priority;
    private final LocalDateTime createdAt;
    private NotificationStatus status;
    private int retryCount;
    
    public Notification(String id, String userId, String message, 
                       NotificationChannel channel, Priority priority) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.channel = channel;
        this.priority = priority;
        this.createdAt = LocalDateTime.now();
        this.status = NotificationStatus.PENDING;
        this.retryCount = 0;
    }
    
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getMessage() { return message; }
    public NotificationChannel getChannel() { return channel; }
    public Priority getPriority() { return priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public NotificationStatus getStatus() { return status; }
    public int getRetryCount() { return retryCount; }
    
    public void setStatus(NotificationStatus status) {
        this.status = status;
    }
    
    public void incrementRetry() {
        this.retryCount++;
    }
    
    @Override
    public String toString() {
        return "Notification{id='" + id + "', channel=" + channel + 
               ", priority=" + priority + ", status=" + status + "}";
    }
}
