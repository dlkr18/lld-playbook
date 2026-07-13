package com.you.lld.problems.ministore.model;

/**
 * A frozen line in a placed order. Unlike a CartLine it captures the product NAME and
 * UNIT PRICE at order time — so a later catalog price change never rewrites history.
 */
public final class OrderLine {

    private final String productId;
    private final String productName;
    private final Money unitPrice;
    private final int quantity;
    private final Money lineTotal;

    public OrderLine(String productId, String productName, Money unitPrice, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = unitPrice.times(quantity);
    }

    public String productId() { return productId; }
    public String productName() { return productName; }
    public Money unitPrice() { return unitPrice; }
    public int quantity() { return quantity; }
    public Money lineTotal() { return lineTotal; }

    @Override
    public String toString() {
        return quantity + "x " + productName + " @ " + unitPrice + " = " + lineTotal;
    }
}
