package com.you.lld.problems.ministore.model.exceptions;

/** Raised when an order/deduction would drive stock negative (overselling). */
public class InsufficientInventoryException extends StoreException {

    private final String product;
    private final int requested;
    private final int available;

    public InsufficientInventoryException(String product, int requested, int available) {
        super("insufficient inventory for '" + product + "': requested " + requested
            + ", available " + available);
        this.product = product;
        this.requested = requested;
        this.available = available;
    }

    public String product() { return product; }
    public int requested() { return requested; }
    public int available() { return available; }
}
