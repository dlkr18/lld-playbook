package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;

public class ConnectionRequest {
    private final String requestId;
    private final String senderId;
    private final String receiverId;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    
    public ConnectionRequest(String requestId, String senderId, String receiverId) {
        this.requestId = requestId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = RequestStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getRequestId() { return requestId; }
    public String getSenderId() { return senderId; }
    public String getReceiverId() { return receiverId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public RequestStatus getStatus() { return status; }
    public void accept() { this.status = RequestStatus.ACCEPTED; }
    public void reject() { this.status = RequestStatus.REJECTED; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}