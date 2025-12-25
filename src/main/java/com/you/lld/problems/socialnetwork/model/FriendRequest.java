package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;

public class FriendRequest {
    private final String requestId;
    private final String senderId;
    private final String receiverId;
    private FriendRequestStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;
    
    public FriendRequest(String requestId, String senderId, String receiverId) {
        this.requestId = requestId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = FriendRequestStatus.PENDING;
        this.sentAt = LocalDateTime.now();
    }
    
    public String getRequestId() { return requestId; }
    public String getSenderId() { return senderId; }
    public String getReceiverId() { return receiverId; }
    public FriendRequestStatus getStatus() { return status; }
    
    public void accept() {
        this.status = FriendRequestStatus.ACCEPTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    public void reject() {
        this.status = FriendRequestStatus.REJECTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
}
