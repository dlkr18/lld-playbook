package com.you.lld.problems.socialnetwork.api;

import com.you.lld.problems.socialnetwork.model.*;

public interface NotificationService {
    void sendNotification(Notification notification);
    void notifyFriendRequest(String senderId, String receiverId);
    void notifyPostLike(String likerId, String postId);
    void notifyComment(String commenterId, String postId);
    void notifyFollow(String followerId, String followingId);
}
