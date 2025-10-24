package com.you.lld.examples.week2.day6.factory;

/**
 * Exception thrown when payment processing fails.
 * Provides specific error codes and messages for different failure scenarios.
 */
public class PaymentException extends Exception {
    private final String errorCode;
    private final PaymentMethod paymentMethod;
    
    public PaymentException(String errorCode, String message, PaymentMethod paymentMethod) {
        super(message);
        this.errorCode = errorCode;
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentException(String errorCode, String message, PaymentMethod paymentMethod, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.paymentMethod = paymentMethod;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    // Common error codes
    public static class ErrorCodes {
        public static final String INVALID_CARD_NUMBER = "INVALID_CARD_NUMBER";
        public static final String EXPIRED_CARD = "EXPIRED_CARD";
        public static final String INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
        public static final String INVALID_CVV = "INVALID_CVV";
        public static final String CARD_DECLINED = "CARD_DECLINED";
        public static final String INVALID_PAYPAL_EMAIL = "INVALID_PAYPAL_EMAIL";
        public static final String PAYPAL_ACCOUNT_SUSPENDED = "PAYPAL_ACCOUNT_SUSPENDED";
        public static final String INVALID_BANK_ACCOUNT = "INVALID_BANK_ACCOUNT";
        public static final String NETWORK_ERROR = "NETWORK_ERROR";
        public static final String PROCESSING_ERROR = "PROCESSING_ERROR";
        public static final String UNSUPPORTED_CURRENCY = "UNSUPPORTED_CURRENCY";
        public static final String AMOUNT_TOO_SMALL = "AMOUNT_TOO_SMALL";
        public static final String AMOUNT_TOO_LARGE = "AMOUNT_TOO_LARGE";
    }
}
