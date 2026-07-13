package com.you.lld.problems.ministore.service;

import com.you.lld.problems.ministore.model.Money;

/** What the platform hands the payment gateway. No card data — this is an abstraction. */
public final class PaymentRequest {

    private final String orderId;
    private final Money amount;
    private final String method;   // opaque: "CARD", "WALLET", ... — gateway decides

    public PaymentRequest(String orderId, Money amount, String method) {
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
    }

    public String orderId() { return orderId; }
    public Money amount() { return amount; }
    public String method() { return method; }
}
