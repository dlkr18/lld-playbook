package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Immutable record of a completed ATM operation.
 */
public final class Transaction {

    public enum Type {WITHDRAWAL, DEPOSIT, BALANCE_INQUIRY}

    private final String id;
    private final String accountNumber;
    private final Type type;
    private final BigDecimal amount;
    private final BigDecimal balanceAfter;
    private final LocalDateTime timestamp;

    public Transaction(String id, String accountNumber, Type type,
                       BigDecimal amount, BigDecimal balanceAfter) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public Type getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return type + " $" + amount + " → bal=$" + balanceAfter;
    }
}
