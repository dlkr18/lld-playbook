package com.you.lld.examples.week2.day6.factory;

/**
 * Enum representing different payment methods supported by the system.
 * Used by the Factory pattern to determine which PaymentProcessor to create.
 */
public enum PaymentMethod {
    CREDIT_CARD("Credit Card", "CC"),
    DEBIT_CARD("Debit Card", "DC"),
    PAYPAL("PayPal", "PP"),
    APPLE_PAY("Apple Pay", "AP"),
    GOOGLE_PAY("Google Pay", "GP"),
    BANK_TRANSFER("Bank Transfer", "BT"),
    CRYPTOCURRENCY("Cryptocurrency", "CR");
    
    private final String displayName;
    private final String code;
    
    PaymentMethod(String displayName, String code) {
        this.displayName = displayName;
        this.code = code;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getCode() {
        return code;
    }
    
    /**
     * Get PaymentMethod from code.
     * 
     * @param code The payment method code
     * @return PaymentMethod or null if not found
     */
    public static PaymentMethod fromCode(String code) {
        for (PaymentMethod method : values()) {
            if (method.code.equals(code)) {
                return method;
            }
        }
        return null;
    }
}
