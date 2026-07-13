package com.you.lld.problems.ministore.service.impl;

import com.you.lld.problems.ministore.model.Money;
import com.you.lld.problems.ministore.service.PaymentGateway;
import com.you.lld.problems.ministore.service.PaymentRequest;
import com.you.lld.problems.ministore.service.PaymentResult;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Deterministic test gateway that declines any charge over a configured limit (a stand-in
 * for real decline reasons like "insufficient funds"). Lets the demo show the rollback
 * path without randomness.
 */
public final class ThresholdPaymentGateway implements PaymentGateway {

    private final Money limit;
    private final AtomicLong seq = new AtomicLong(5000);

    public ThresholdPaymentGateway(Money limit) { this.limit = limit; }

    public PaymentResult charge(PaymentRequest request) {
        if (request.amount().amount().compareTo(limit.amount()) > 0) {
            return PaymentResult.declined("amount " + request.amount() + " exceeds limit " + limit);
        }
        return PaymentResult.approved("txn-" + seq.incrementAndGet());
    }
}
