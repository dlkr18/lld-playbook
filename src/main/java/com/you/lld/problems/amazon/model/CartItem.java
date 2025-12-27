package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;

public class CartItem {
    private final String productId;
    private final String productName;
    private final BigDecimal price;
    private int quantity;
    
    public CartItem(String productId, String productName, BigDecimal price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }
    
    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
    
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    @Override
    public String toString() {
        return "CartItem{productId='" + productId + "', name='" + productName + 
               "', price=" + price + ", qty=" + quantity + ", subtotal=" + getSubtotal() + "}";
    }
}
