package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Bank transfer processor implementation.
 * Demonstrates a different payment method with different validation requirements.
 */
public class BankTransferProcessor implements PaymentProcessor {
    
    private static final BigDecimal BANK_TRANSFER_FEE = new BigDecimal("1.50"); // Flat fee
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.BANK_TRANSFER
            );
        }
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_BANK_ACCOUNT,
                "Invalid bank account details",
                PaymentMethod.BANK_TRANSFER
            );
        }
        
        String transactionId = "BT_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        BigDecimal processingFee = getProcessingFee(amount, currency);
        
        // Bank transfers typically take longer to process
        return PaymentResult.builder()
                .success(true)
                .transactionId(transactionId)
                .amount(amount)
                .currency(currency)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .processingFee(processingFee)
                .message("Bank transfer initiated successfully. Processing may take 1-3 business days.")
                .build();
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        String accountNumber = paymentDetails.getAccountNumber();
        String routingNumber = paymentDetails.getRoutingNumber();
        
        return isValidAccountNumber(accountNumber) && isValidRoutingNumber(routingNumber);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.BANK_TRANSFER;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        // Bank transfers typically support local currency only
        return "USD".equals(currency);
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        return BANK_TRANSFER_FEE;
    }
    
    private boolean isValidAccountNumber(String accountNumber) {
        return accountNumber != null && 
               accountNumber.matches("\\d{8,17}"); // 8-17 digits
    }
    
    private boolean isValidRoutingNumber(String routingNumber) {
        return routingNumber != null && 
               routingNumber.matches("\\d{9}"); // Exactly 9 digits for US routing numbers
    }
}
