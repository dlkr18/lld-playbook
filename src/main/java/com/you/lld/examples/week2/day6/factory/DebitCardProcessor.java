package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;

/**
 * Debit card processor - extends credit card processor with different fees.
 * Demonstrates inheritance in factory pattern implementations.
 */
public class DebitCardProcessor extends CreditCardProcessor {
    
    private static final BigDecimal DEBIT_FEE_PERCENTAGE = new BigDecimal("0.015"); // 1.5% (lower than credit)
    private static final BigDecimal DEBIT_FIXED_FEE = new BigDecimal("0.25");
    
    public DebitCardProcessor() {
        super();
        // Override default configuration for debit cards
        getConfiguration().setProcessingFeePercentage(DEBIT_FEE_PERCENTAGE);
        getConfiguration().setFixedProcessingFee(DEBIT_FIXED_FEE);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.DEBIT_CARD;
    }
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Debit cards have additional validation - check for PIN if required
        // In this example, we'll just call the parent implementation
        PaymentResult result = super.processPayment(amount, currency, paymentDetails);
        
        // Modify transaction ID to indicate debit card
        if (result.isSuccess()) {
            String originalTxnId = result.getTransactionId();
            String debitTxnId = originalTxnId.replace("CC_", "DC_");
            
            return PaymentResult.builder()
                    .success(true)
                    .transactionId(debitTxnId)
                    .amount(result.getAmount())
                    .currency(result.getCurrency())
                    .paymentMethod(PaymentMethod.DEBIT_CARD)
                    .processingFee(result.getProcessingFee())
                    .message("Debit card payment processed successfully")
                    .timestamp(result.getTimestamp())
                    .build();
        }
        
        return result;
    }
}
