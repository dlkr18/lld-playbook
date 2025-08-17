package com.you.lld.parkinglot.model;

/**
 * Enumeration of supported payment methods.
 */
public enum PaymentMethod {
  CASH("Cash Payment"),
  CREDIT_CARD("Credit Card"),
  DEBIT_CARD("Debit Card"),
  MOBILE_PAYMENT("Mobile Payment (UPI/Wallet)");
  
  private final String displayName;
  
  PaymentMethod(String displayName) {
    this.displayName = displayName;
  }
  
  public String getDisplayName() {
    return displayName;
  }
}
