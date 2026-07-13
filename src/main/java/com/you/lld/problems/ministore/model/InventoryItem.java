package com.you.lld.problems.ministore.model;

import com.you.lld.problems.ministore.model.exceptions.InsufficientInventoryException;

/**
 * Mutable stock for one product. The "never oversell" invariant lives HERE, inside
 * {@link #deduct}: it is impossible to drive availability negative, no matter what a
 * caller does. Centralizing the guard means every code path (order, adjustment, admin)
 * is protected by one rule.
 *
 * Thread-safety is intentionally out of scope for v1 (see INTERVIEW.md); making the
 * check-then-decrement atomic is a one-method change (synchronize deduct/restock, or
 * swap to an AtomicInteger CAS loop).
 */
public final class InventoryItem {

    private final String productId;
    private final String storeId;
    private int available;

    public InventoryItem(String productId, String storeId, int initial) {
        if (initial < 0) throw new IllegalArgumentException("initial stock cannot be negative");
        this.productId = productId;
        this.storeId = storeId;
        this.available = initial;
    }

    public String productId() { return productId; }
    public String storeId() { return storeId; }
    public int available() { return available; }

    /** Reserve {@code qty} units, or reject the whole request. Never goes negative. */
    public void deduct(int qty, String productName) {
        if (qty <= 0) throw new IllegalArgumentException("quantity must be positive");
        if (qty > available) {
            throw new InsufficientInventoryException(productName, qty, available);
        }
        available -= qty;
    }

    /** Return units (used to roll back a failed order, or restock). */
    public void restock(int qty) {
        if (qty <= 0) throw new IllegalArgumentException("quantity must be positive");
        available += qty;
    }
}
