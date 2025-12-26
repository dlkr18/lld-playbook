package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Transaction {
    private final String id;
    private final String accountNumber;
    private final TransactionType type;
    private final BigDecimal amount;
    private final LocalDateTime timestamp;
    private final BigDecimal balanceAfter;
    
    public Transaction(String id, String accountNumber, TransactionType type, 
                      BigDecimal amount, BigDecimal balanceAfter) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.balanceAfter = balanceAfter;
    }
    
    public String getId() { return id; }
    public TransactionType getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    
    @Override
    public String toString() {
        return "Transaction{id='" + id + "', type=" + type + ", amount=" + amount + 
               ", balance=" + balanceAfter + "}";
    }
}
