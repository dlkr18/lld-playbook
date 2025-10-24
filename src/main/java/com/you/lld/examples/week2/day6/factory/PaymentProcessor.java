package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;

/**
 * Payment processor interface demonstrating the Factory pattern.
 * 
 * This interface defines the contract that all payment processors must implement.
 * Different implementations handle different payment methods (Credit Card, PayPal, etc.)
 */
public interface PaymentProcessor {
    
    /**
     * Process a payment transaction.
     * 
     * @param amount The amount to charge
     * @param currency The currency code (USD, EUR, etc.)
     * @param paymentDetails Payment-specific details (card number, PayPal email, etc.)
     * @return PaymentResult indicating success or failure
     * @throws PaymentException if payment processing fails
     */
    PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) throws PaymentException;
    
    /**
     * Validate payment details before processing.
     * 
     * @param paymentDetails The payment details to validate
     * @return true if valid, false otherwise
     */
    boolean validatePaymentDetails(PaymentDetails paymentDetails);
    
    /**
     * Get the supported payment method for this processor.
     * 
     * @return The payment method this processor handles
     */
    PaymentMethod getSupportedPaymentMethod();
    
    /**
     * Check if this processor supports the given currency.
     * 
     * @param currency The currency code to check
     * @return true if supported, false otherwise
     */
    boolean supportsCurrency(String currency);
    
    /**
     * Get the processing fee for a given amount.
     * 
     * @param amount The transaction amount
     * @param currency The currency code
     * @return The processing fee
     */
    BigDecimal getProcessingFee(BigDecimal amount, String currency);
}
