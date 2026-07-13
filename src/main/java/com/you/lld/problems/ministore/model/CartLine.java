package com.you.lld.problems.ministore.model;

/** One line in a cart: a product id + desired quantity. Immutable snapshot. */
public final class CartLine {

    private final String productId;
    private final int quantity;

    public CartLine(String productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("quantity must be positive");
        this.productId = productId;
        this.quantity = quantity;
    }

    public String productId() { return productId; }
    public int quantity() { return quantity; }
}
