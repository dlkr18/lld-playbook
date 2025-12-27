package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;

public class Payment {
    private final String id;
    private final String orderId;
    private final BigDecimal amount;
    private final PaymentMethod method;
    
    public Payment(String id, String orderId, BigDecimal amount, PaymentMethod method) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
    }
    
    public String getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
}
