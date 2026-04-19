package com.you.lld.problems.atm.model;

import java.time.LocalDate;

/**
 * Debit/credit card with PIN validation and auto-block after 3 failed attempts.
 */
public final class Card {

    private static final int MAX_ATTEMPTS = 3;

    private final String cardNumber;
    private final String accountNumber;
    private final LocalDate expiryDate;
    private String pin;
    private boolean blocked;
    private int failedAttempts;

    public Card(String cardNumber, String pin, String accountNumber, LocalDate expiryDate) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
        this.expiryDate = expiryDate;
    }

    public boolean validatePin(String input) {
        if (blocked) return false;
        if (pin.equals(input)) {
            failedAttempts = 0;
            return true;
        }
        failedAttempts++;
        if (failedAttempts >= MAX_ATTEMPTS) blocked = true;
        return false;
    }

    public void changePin(String oldPin, String newPin) {
        if (!pin.equals(oldPin)) throw new IllegalArgumentException("old PIN incorrect");
        if (newPin == null || newPin.length() < 4) throw new IllegalArgumentException("new PIN too short");
        this.pin = newPin;
    }

    public boolean isExpired() {
        return LocalDate.now().isAfter(expiryDate);
    }

    public boolean isBlocked() {
        return blocked;
    }

    public boolean isUsable() {
        return !blocked && !isExpired();
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    @Override
    public String toString() {
        return "Card{" + cardNumber.substring(cardNumber.length() - 4) + "}";
    }
}
