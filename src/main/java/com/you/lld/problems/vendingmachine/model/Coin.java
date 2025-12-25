package com.you.lld.problems.vendingmachine.model;

/**
 * Enumeration of coins accepted by the vending machine.
 */
public enum Coin {
    PENNY(1, "Penny", "1¢"),
    NICKEL(5, "Nickel", "5¢"),
    DIME(10, "Dime", "10¢"),
    QUARTER(25, "Quarter", "25¢");
    
    private final int valueInCents;
    private final String name;
    private final String symbol;
    
    Coin(int valueInCents, String name, String symbol) {
        this.valueInCents = valueInCents;
        this.name = name;
        this.symbol = symbol;
    }
    
    public int getValueInCents() {
        return valueInCents;
    }
    
    public Money toMoney() {
        return Money.cents(valueInCents);
    }
    
    public String getName() {
        return name;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    /**
     * Get coin by value in cents.
     */
    public static Coin fromCents(int cents) {
        for (Coin coin : values()) {
            if (coin.valueInCents == cents) {
                return coin;
            }
        }
        throw new IllegalArgumentException("No coin with value: " + cents + " cents");
    }
}
