package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * PayPal payment processor implementation.
 * Simpler implementation focusing on PayPal-specific logic.
 */
public class PayPalProcessor implements PaymentProcessor {
    
    private static final Set<String> SUPPORTED_CURRENCIES = new HashSet<>(
        Arrays.asList("USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK")
    );
    
    private static final BigDecimal PAYPAL_FEE_PERCENTAGE = new BigDecimal("0.034"); // 3.4%
    private static final BigDecimal PAYPAL_FIXED_FEE = new BigDecimal("0.35");
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Validate inputs
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.PAYPAL
            );
        }
        
        if (!supportsCurrency(currency)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.UNSUPPORTED_CURRENCY,
                "Currency " + currency + " is not supported by PayPal",
                PaymentMethod.PAYPAL
            );
        }
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_PAYPAL_EMAIL,
                "Invalid PayPal email address",
                PaymentMethod.PAYPAL
            );
        }
        
        try {
            String transactionId = generateTransactionId();
            BigDecimal processingFee = getProcessingFee(amount, currency);
            
            // Simulate PayPal payment processing
            return simulatePayPalPayment(transactionId, amount, currency, processingFee, paymentDetails);
            
        } catch (Exception e) {
            throw new PaymentException(
                PaymentException.ErrorCodes.PROCESSING_ERROR,
                "Failed to process PayPal payment: " + e.getMessage(),
                PaymentMethod.PAYPAL,
                e
            );
        }
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        String paypalEmail = paymentDetails.getPayPalEmail();
        return isValidEmail(paypalEmail);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.PAYPAL;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        return currency != null && SUPPORTED_CURRENCIES.contains(currency.toUpperCase());
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal variableFee = amount.multiply(PAYPAL_FEE_PERCENTAGE);
        return variableFee.add(PAYPAL_FIXED_FEE).setScale(2, RoundingMode.HALF_UP);
    }
    
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Basic email validation
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    private String generateTransactionId() {
        return "PP_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    private PaymentResult simulatePayPalPayment(String transactionId, BigDecimal amount, 
                                              String currency, BigDecimal processingFee, 
                                              PaymentDetails paymentDetails) {
        
        String paypalEmail = paymentDetails.getPayPalEmail();
        
        // Simulate different outcomes for testing
        if (paypalEmail.contains("suspended")) {
            return PaymentResult.failure(
                PaymentException.ErrorCodes.PAYPAL_ACCOUNT_SUSPENDED,
                "PayPal account is suspended",
                PaymentMethod.PAYPAL
            );
        }
        
        if (paypalEmail.contains("insufficient")) {
            return PaymentResult.failure(
                PaymentException.ErrorCodes.INSUFFICIENT_FUNDS,
                "Insufficient funds in PayPal account",
                PaymentMethod.PAYPAL
            );
        }
        
        // Simulate successful payment
        return PaymentResult.success(transactionId, amount, currency, PaymentMethod.PAYPAL, processingFee);
    }
}
