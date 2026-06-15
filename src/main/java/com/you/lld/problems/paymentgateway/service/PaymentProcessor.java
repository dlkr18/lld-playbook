package com.you.lld.problems.paymentgateway.service;

import com.you.lld.problems.paymentgateway.model.Transaction;

/** Strategy — payment-method-specific processing. */
public interface PaymentProcessor {
    boolean charge(Transaction transaction);
}
