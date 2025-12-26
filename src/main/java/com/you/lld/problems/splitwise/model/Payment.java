package com.you.lld.problems.splitwise.model;

import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String payerId;
    private final String payeeId;
    private final double amount;
    private final LocalDateTime timestamp;
    
    public Payment(String id, String payerId, String payeeId, double amount) {
        this.id = id;
        this.payerId = payerId;
        this.payeeId = payeeId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public double getAmount() { return amount; }
}
