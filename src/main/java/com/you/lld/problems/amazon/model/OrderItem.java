package com.you.lld.problems.amazon.model;

public class OrderItem {
    private final String productId;
    private String productName;
    private double price;
    private int quantity;
    private String sellerId;
    
    public OrderItem(String productId, String productName, double price, int quantity, String sellerId) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.sellerId = sellerId;
    }
    
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getSellerId() { return sellerId; }
    public double getTotal() { return price * quantity; }
}
