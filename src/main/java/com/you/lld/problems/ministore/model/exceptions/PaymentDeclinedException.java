package com.you.lld.problems.ministore.model.exceptions;

/** Raised when the payment gateway declines — the order is cancelled and stock rolled back. */
public class PaymentDeclinedException extends StoreException {

    private final String orderId;

    public PaymentDeclinedException(String orderId, String reason) {
        super("payment declined for order " + orderId + ": " + reason);
        this.orderId = orderId;
    }

    public String orderId() { return orderId; }
}
