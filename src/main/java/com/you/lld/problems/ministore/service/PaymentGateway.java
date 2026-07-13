package com.you.lld.problems.ministore.service;

/**
 * The pluggable payment abstraction the brief explicitly asks for (Strategy pattern).
 * The order flow depends only on this interface, so Stripe / PayPal / a test double
 * are drop-in — the platform never learns which provider it's talking to.
 */
public interface PaymentGateway {
    PaymentResult charge(PaymentRequest request);
}
