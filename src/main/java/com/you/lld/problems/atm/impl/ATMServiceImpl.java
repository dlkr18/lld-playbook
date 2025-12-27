package com.you.lld.problems.atm.impl;

import com.you.lld.problems.atm.api.ATMService;
import com.you.lld.problems.atm.model.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ATMServiceImpl implements ATMService {
    private final Map<String, Card> cards = new ConcurrentHashMap<>();
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final CashDispenser cashDispenser = new CashDispenser();
    
    public void addCard(Card card) {
        cards.put(card.getCardNumber(), card);
    }
    
    public void addAccount(Account account) {
        accounts.put(account.getAccountNumber(), account);
    }
    
    @Override
    public boolean authenticateCard(String cardNumber, String pin) {
        Card card = cards.get(cardNumber);
        if (card == null || card.isExpired()) {
            return false;
        }
        return card.validatePin(pin);
    }
    
    @Override
    public BigDecimal checkBalance(String accountNumber) {
        Account account = accounts.get(accountNumber);
        if (account == null) {
            throw new IllegalArgumentException("Account not found");
        }
        
        Transaction txn = new Transaction(
            UUID.randomUUID().toString(),
            accountNumber,
            TransactionType.BALANCE_INQUIRY,
            BigDecimal.ZERO,
            account.getBalance()
        );
        account.addTransaction(txn);
        
        return account.getBalance();
    }
    
    @Override
    public boolean withdraw(String accountNumber, BigDecimal amount) {
        Account account = accounts.get(accountNumber);
        if (account == null) {
            return false;
        }
        
        if (!cashDispenser.dispenseCash(amount)) {
            System.out.println("Insufficient cash in ATM");
            return false;
        }
        
        if (account.withdraw(amount)) {
            Transaction txn = new Transaction(
                UUID.randomUUID().toString(),
                accountNumber,
                TransactionType.WITHDRAWAL,
                amount,
                account.getBalance()
            );
            account.addTransaction(txn);
            System.out.println("Withdrawal successful: $" + amount);
            return true;
        }
        
        return false;
    }
    
    @Override
    public void deposit(String accountNumber, BigDecimal amount) {
        Account account = accounts.get(accountNumber);
        if (account != null) {
            account.deposit(amount);
            Transaction txn = new Transaction(
                UUID.randomUUID().toString(),
                accountNumber,
                TransactionType.DEPOSIT,
                amount,
                account.getBalance()
            );
            account.addTransaction(txn);
            System.out.println("Deposit successful: $" + amount);
        }
    }
    
    @Override
    public boolean changePin(String cardNumber, String oldPin, String newPin) {
        Card card = cards.get(cardNumber);
        if (card != null && authenticateCard(cardNumber, oldPin)) {
            // In real system, would update PIN
            System.out.println("PIN changed successfully");
            return true;
        }
        return false;
    }
}
