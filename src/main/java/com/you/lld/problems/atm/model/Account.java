package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.*;

public class Account {
    private final String accountNumber;
    private BigDecimal balance;
    private final AccountType type;
    private final List<Transaction> transactions;
    
    public Account(String accountNumber, BigDecimal initialBalance, AccountType type) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.type = type;
        this.transactions = new ArrayList<>();
    }
    
    public synchronized boolean withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) {
            return false;
        }
        balance = balance.subtract(amount);
        return true;
    }
    
    public synchronized void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }
    
    public synchronized void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }
    
    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public AccountType getType() { return type; }
    public List<Transaction> getTransactions() { return new ArrayList<>(transactions); }
}
