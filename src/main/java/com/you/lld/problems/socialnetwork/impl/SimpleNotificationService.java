package com.you.lld.problems.socialnetwork.impl;

import com.you.lld.problems.socialnetwork.api.NotificationService;
import com.you.lld.problems.socialnetwork.model.*;
import java.util.*;

public class SimpleNotificationService implements NotificationService {
    private final Map<String, Notification> notifications;
    
    public SimpleNotificationService(Map<String, Notification> notifications) {
        this.notifications = notifications;
    }
    
    @Override
    public void sendNotification(Notification notification) {
        notifications.put(notification.getNotificationId(), notification);
    }
    
    @Override
    public void notifyFriendRequest(String senderId, String receiverId) {
        String notifId = UUID.randomUUID().toString();
        Notification notification = new Notification(
            notifId, receiverId, NotificationType.FRIEND_REQUEST,
            senderId, null, "sent you a friend request"
        );
        sendNotification(notification);
    }
    
    @Override
    public void notifyPostLike(String likerId, String postId) {
        String notifId = UUID.randomUUID().toString();
        // In real implementation, get post author and notify them
        // For now, simplified
    }
    
    @Override
    public void notifyComment(String commenterId, String postId) {
        String notifId = UUID.randomUUID().toString();
        // In real implementation, get post author and notify them
    }
    
    @Override
    public void notifyFollow(String followerId, String followingId) {
        String notifId = UUID.randomUUID().toString();
        Notification notification = new Notification(
            notifId, followingId, NotificationType.USER_FOLLOWED,
            followerId, null, "started following you"
        );
        sendNotification(notification);
    }
}
