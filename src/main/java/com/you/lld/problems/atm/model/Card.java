package com.you.lld.problems.atm.model;

import java.time.LocalDate;

public class Card {
    private final String cardNumber;
    private final String pin;
    private final String accountNumber;
    private final LocalDate expiryDate;
    private CardStatus status;
    private int failedAttempts;
    
    public Card(String cardNumber, String pin, String accountNumber, LocalDate expiryDate) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
        this.expiryDate = expiryDate;
        this.status = CardStatus.ACTIVE;
        this.failedAttempts = 0;
    }
    
    public boolean validatePin(String inputPin) {
        if (status == CardStatus.BLOCKED) {
            return false;
        }
        
        if (this.pin.equals(inputPin)) {
            failedAttempts = 0;
            return true;
        }
        
        failedAttempts++;
        if (failedAttempts >= 3) {
            status = CardStatus.BLOCKED;
        }
        return false;
    }
    
    public boolean isExpired() {
        return LocalDate.now().isAfter(expiryDate);
    }
    
    public String getCardNumber() { return cardNumber; }
    public String getAccountNumber() { return accountNumber; }
    public CardStatus getStatus() { return status; }
    public int getFailedAttempts() { return failedAttempts; }
    
    public void block() { this.status = CardStatus.BLOCKED; }
    public void unblock() { this.status = CardStatus.ACTIVE; this.failedAttempts = 0; }
}
