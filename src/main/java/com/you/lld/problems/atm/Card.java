package com.you.lld.problems.atm;

public class Card {
    private final String cardNumber;
    private final String pin;
    private final String accountNumber;
    
    public Card(String cardNumber, String pin, String accountNumber) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
    }
    
    public String getCardNumber() { return cardNumber; }
    public boolean validatePin(String inputPin) { return pin.equals(inputPin); }
    public String getAccountNumber() { return accountNumber; }
}
