package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Result of a payment processing operation.
 * Contains information about the success/failure and transaction details.
 */
public class PaymentResult {
    private final boolean success;
    private final String transactionId;
    private final String message;
    private final BigDecimal amount;
    private final String currency;
    private final PaymentMethod paymentMethod;
    private final LocalDateTime timestamp;
    private final String errorCode;
    private final BigDecimal processingFee;
    
    private PaymentResult(Builder builder) {
        this.success = builder.success;
        this.transactionId = builder.transactionId;
        this.message = builder.message;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.paymentMethod = builder.paymentMethod;
        this.timestamp = builder.timestamp != null ? builder.timestamp : LocalDateTime.now();
        this.errorCode = builder.errorCode;
        this.processingFee = builder.processingFee;
    }
    
    // Static factory methods for common scenarios
    public static PaymentResult success(String transactionId, BigDecimal amount, String currency, 
                                       PaymentMethod paymentMethod, BigDecimal processingFee) {
        return new Builder()
                .success(true)
                .transactionId(transactionId)
                .amount(amount)
                .currency(currency)
                .paymentMethod(paymentMethod)
                .processingFee(processingFee)
                .message("Payment processed successfully")
                .build();
    }
    
    public static PaymentResult failure(String errorCode, String message, PaymentMethod paymentMethod) {
        return new Builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .paymentMethod(paymentMethod)
                .build();
    }
    
    // Getters
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
    public String getMessage() { return message; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getErrorCode() { return errorCode; }
    public BigDecimal getProcessingFee() { return processingFee; }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private boolean success;
        private String transactionId;
        private String message;
        private BigDecimal amount;
        private String currency;
        private PaymentMethod paymentMethod;
        private LocalDateTime timestamp;
        private String errorCode;
        private BigDecimal processingFee;
        
        public Builder success(boolean success) {
            this.success = success;
            return this;
        }
        
        public Builder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }
        
        public Builder message(String message) {
            this.message = message;
            return this;
        }
        
        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }
        
        public Builder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }
        
        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public Builder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }
        
        public Builder processingFee(BigDecimal processingFee) {
            this.processingFee = processingFee;
            return this;
        }
        
        public PaymentResult build() {
            return new PaymentResult(this);
        }
    }
    
    @Override
    public String toString() {
        return "PaymentResult{" +
               "success=" + success +
               ", transactionId='" + transactionId + '\'' +
               ", message='" + message + '\'' +
               ", amount=" + amount +
               ", currency='" + currency + '\'' +
               ", paymentMethod=" + paymentMethod +
               ", timestamp=" + timestamp +
               ", errorCode='" + errorCode + '\'' +
               ", processingFee=" + processingFee +
               '}';
    }
}
