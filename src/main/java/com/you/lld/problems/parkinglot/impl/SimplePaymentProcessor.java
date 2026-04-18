package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PaymentProcessor;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;

import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory simulation of a payment gateway.
 *
 * Records every processed payment so refunds can verify the original txn
 * exists. In production this would wrap Stripe / Razorpay / Adyen SDKs.
 *
 * Thread-safe: supportedMethods is immutable after construction;
 * processedPayments is a ConcurrentHashMap.
 */
public class SimplePaymentProcessor implements PaymentProcessor {

    private final Set<PaymentMethod> supportedMethods;
    private final Map<PaymentMethod, BigDecimal> transactionFeeRates;
    private final Map<String, Payment> processedPayments = new ConcurrentHashMap<>();

    public SimplePaymentProcessor() {
        this.supportedMethods = EnumSet.allOf(PaymentMethod.class);
        this.transactionFeeRates = new HashMap<>();
        this.transactionFeeRates.put(PaymentMethod.CASH, BigDecimal.ZERO);
        this.transactionFeeRates.put(PaymentMethod.CREDIT_CARD, new BigDecimal("0.025"));
        this.transactionFeeRates.put(PaymentMethod.DEBIT_CARD, new BigDecimal("0.015"));
        this.transactionFeeRates.put(PaymentMethod.MOBILE_PAYMENT, new BigDecimal("0.020"));
    }

    public SimplePaymentProcessor(Set<PaymentMethod> supportedMethods,
                                  Map<PaymentMethod, BigDecimal> transactionFeeRates) {
        Objects.requireNonNull(supportedMethods, "supportedMethods");
        Objects.requireNonNull(transactionFeeRates, "transactionFeeRates");
        if (supportedMethods.isEmpty())
            throw new IllegalArgumentException("at least one supported method required");
        this.supportedMethods = EnumSet.copyOf(supportedMethods);
        this.transactionFeeRates = new HashMap<>(transactionFeeRates);
    }

    @Override
    public boolean processPayment(Payment payment) throws PaymentProcessingException {
        Objects.requireNonNull(payment, "payment");
        if (!supportsPaymentMethod(payment.getPaymentMethod())) {
            throw new PaymentProcessingException("unsupported payment method: " + payment.getPaymentMethod());
        }
        if (payment.getAmount() == null || payment.getAmount().isNegative()) {
            throw new PaymentProcessingException("invalid amount");
        }
        processedPayments.put(payment.getPaymentId(), payment);
        return true;
    }

    @Override
    public boolean refundPayment(Payment payment) throws RefundException {
        Objects.requireNonNull(payment, "payment");
        if (!processedPayments.containsKey(payment.getPaymentId())) {
            throw new RefundException("payment not found: " + payment.getPaymentId());
        }
        if (!payment.isSuccessful()) {
            throw new RefundException("can only refund COMPLETED payments; was " + payment.getStatus());
        }
        return true;
    }

    @Override
    public boolean supportsPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethod != null && supportedMethods.contains(paymentMethod);
    }

    @Override
    public Money getTransactionFee(Money amount, PaymentMethod paymentMethod) {
        Objects.requireNonNull(amount, "amount");
        Objects.requireNonNull(paymentMethod, "paymentMethod");
        if (!supportsPaymentMethod(paymentMethod)) {
            return Money.ofMinor(0, amount.currency());
        }
        BigDecimal rate = transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
        int basisPoints = rate.multiply(new BigDecimal("10000")).intValue();
        return amount.percent(basisPoints);
    }

    public Set<PaymentMethod> getSupportedMethods() {
        return EnumSet.copyOf(supportedMethods);
    }

    public int getProcessedPaymentCount() {
        return processedPayments.size();
    }
}
