package com.you.lld.problems.ministore.service.impl;

import com.you.lld.problems.ministore.service.PaymentGateway;
import com.you.lld.problems.ministore.service.PaymentRequest;
import com.you.lld.problems.ministore.service.PaymentResult;

import java.util.concurrent.atomic.AtomicLong;

/** Test/dev gateway that always approves and mints a fake transaction id. */
public final class ApprovingPaymentGateway implements PaymentGateway {

    private final AtomicLong seq = new AtomicLong(1000);

    public PaymentResult charge(PaymentRequest request) {
        return PaymentResult.approved("txn-" + seq.incrementAndGet());
    }
}
