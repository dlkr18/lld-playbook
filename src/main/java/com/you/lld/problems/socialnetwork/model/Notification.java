package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;

public class Notification {
    private final String notificationId;
    private final String userId;
    private final NotificationType type;
    private final String actorId;
    private final String targetId; // postId, commentId, etc.
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    
    public Notification(String notificationId, String userId, NotificationType type, 
                       String actorId, String targetId, String message) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.type = type;
        this.actorId = actorId;
        this.targetId = targetId;
        this.message = message;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getNotificationId() { return notificationId; }
    public String getUserId() { return userId; }
    public NotificationType getType() { return type; }
    public String getActorId() { return actorId; }
    public String getTargetId() { return targetId; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public void markAsRead() { this.read = true; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
