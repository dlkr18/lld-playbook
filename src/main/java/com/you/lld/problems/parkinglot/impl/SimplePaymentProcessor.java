package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PaymentProcessor;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;

import java.math.BigDecimal;
import java.util.*;

/**
 * Simple in-memory payment processor implementation.
 * In production, this would integrate with actual payment gateways.
 */
public class SimplePaymentProcessor implements PaymentProcessor {
  
  private final Set<PaymentMethod> supportedMethods;
  private final Map<PaymentMethod, BigDecimal> transactionFeeRates;
  private final Map<String, Payment> processedPayments;
  
  public SimplePaymentProcessor() {
    this.supportedMethods = EnumSet.allOf(PaymentMethod.class);
    this.transactionFeeRates = new HashMap<>();
    
    // Default transaction fee rates
    this.transactionFeeRates.put(PaymentMethod.CASH, BigDecimal.ZERO);
    this.transactionFeeRates.put(PaymentMethod.CREDIT_CARD, new BigDecimal("0.025")); // 2.5%
    this.transactionFeeRates.put(PaymentMethod.DEBIT_CARD, new BigDecimal("0.015")); // 1.5%
    this.transactionFeeRates.put(PaymentMethod.MOBILE_PAYMENT, new BigDecimal("0.02")); // 2%
    
    this.processedPayments = new HashMap<>();
  }
  
  /**
   * Creates a payment processor with custom supported methods and fee rates.
   */
  public SimplePaymentProcessor(Set<PaymentMethod> supportedMethods, 
                                Map<PaymentMethod, BigDecimal> transactionFeeRates) {
    this.supportedMethods = EnumSet.copyOf(Objects.requireNonNull(supportedMethods));
    this.transactionFeeRates = new HashMap<>(Objects.requireNonNull(transactionFeeRates));
    this.processedPayments = new HashMap<>();
    
    if (supportedMethods.isEmpty()) {
      throw new IllegalArgumentException("At least one payment method must be supported");
    }
  }
  
  @Override
  public boolean processPayment(Payment payment) throws PaymentProcessingException {
    Objects.requireNonNull(payment, "Payment cannot be null");
    
    // Validate payment method is supported
    if (!supportsPaymentMethod(payment.getPaymentMethod())) {
      throw new PaymentProcessingException(
          "Payment method not supported: " + payment.getPaymentMethod()
      );
    }
    
    // Validate payment amount
    if (payment.getAmount() == null || payment.getAmount().isNegative()) {
      throw new PaymentProcessingException("Invalid payment amount");
    }
    
    // Simulate payment processing
    try {
      // In a real system, this would:
      // 1. Connect to payment gateway
      // 2. Process the transaction
      // 3. Handle authentication (3DS, OTP, etc.)
      // 4. Verify funds availability
      // 5. Complete the transaction
      
      // For simulation, we'll add a small delay
      Thread.sleep(100); // Simulate network call
      
      // Store successful payment
      processedPayments.put(payment.getPaymentId(), payment);
      
      return true;
      
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new PaymentProcessingException("Payment processing interrupted", e);
    } catch (Exception e) {
      throw new PaymentProcessingException("Payment processing failed: " + e.getMessage(), e);
    }
  }
  
  @Override
  public boolean refundPayment(Payment payment) throws RefundException {
    Objects.requireNonNull(payment, "Payment cannot be null");
    
    // Verify payment was processed by this processor
    if (!processedPayments.containsKey(payment.getPaymentId())) {
      throw new RefundException("Payment not found in system: " + payment.getPaymentId());
    }
    
    // Verify payment is in completed state
    if (!payment.isSuccessful()) {
      throw new RefundException("Can only refund completed payments");
    }
    
    try {
      // In a real system, this would:
      // 1. Connect to payment gateway
      // 2. Initiate refund transaction
      // 3. Verify refund eligibility
      // 4. Process the refund
      // 5. Update transaction status
      
      // For simulation, we'll add a small delay
      Thread.sleep(100);
      
      return true;
      
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RefundException("Refund processing interrupted", e);
    } catch (Exception e) {
      throw new RefundException("Refund processing failed: " + e.getMessage(), e);
    }
  }
  
  @Override
  public boolean supportsPaymentMethod(PaymentMethod paymentMethod) {
    return paymentMethod != null && supportedMethods.contains(paymentMethod);
  }
  
  @Override
  public Money getTransactionFee(Money amount, PaymentMethod paymentMethod) {
    Objects.requireNonNull(amount, "Amount cannot be null");
    Objects.requireNonNull(paymentMethod, "Payment method cannot be null");
    
    if (!supportsPaymentMethod(paymentMethod)) {
      return Money.ofMinor(0, amount.currency());
    }
    
    BigDecimal feeRate = transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
    // Convert percentage to basis points (e.g., 0.025 = 2.5% = 250 basis points)
    int basisPoints = feeRate.multiply(new BigDecimal("10000")).intValue();
    return amount.percent(basisPoints);
  }
  
  /**
   * Gets all supported payment methods.
   */
  public Set<PaymentMethod> getSupportedMethods() {
    return EnumSet.copyOf(supportedMethods);
  }
  
  /**
   * Gets the transaction fee rate for a payment method.
   */
  public BigDecimal getTransactionFeeRate(PaymentMethod paymentMethod) {
    return transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
  }
  
  /**
   * Gets count of successfully processed payments.
   */
  public int getProcessedPaymentCount() {
    return processedPayments.size();
  }
}
