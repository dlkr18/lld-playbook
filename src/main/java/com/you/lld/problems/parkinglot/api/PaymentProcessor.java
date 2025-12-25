package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.common.Money;

/**
 * Interface for processing payments through different gateways.
 * Supports multiple payment methods and handles transaction lifecycle.
 */
public interface PaymentProcessor {
  
  /**
   * Processes a payment transaction.
   * 
   * @param payment payment details including amount and method
   * @return true if payment successful, false otherwise
   * @throws PaymentProcessingException if payment processing fails
   */
  boolean processPayment(Payment payment) throws PaymentProcessingException;
  
  /**
   * Initiates a refund for a previous payment.
   * 
   * @param payment original payment to refund
   * @return true if refund successful, false otherwise
   * @throws RefundException if refund processing fails
   */
  boolean refundPayment(Payment payment) throws RefundException;
  
  /**
   * Checks if a payment method is supported.
   * 
   * @param paymentMethod payment method to check
   * @return true if supported, false otherwise
   */
  boolean supportsPaymentMethod(PaymentMethod paymentMethod);
  
  /**
   * Gets transaction fee for a payment method and amount.
   * 
   * @param amount transaction amount
   * @param paymentMethod payment method
   * @return transaction fee
   */
  Money getTransactionFee(Money amount, PaymentMethod paymentMethod);
}
