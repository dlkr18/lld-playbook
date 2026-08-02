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
        requirePending("accept");
        this.status = FriendRequestStatus.ACCEPTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    public void reject() {
        requirePending("reject");
        this.status = FriendRequestStatus.REJECTED;
        this.respondedAt = LocalDateTime.now();
    }

    /** A request is answered exactly once; re-answering a settled request is a bug. */
    private void requirePending(String action) {
        if (status != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("cannot " + action + " a request that is already " + status);
        }
    }
    
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
}
