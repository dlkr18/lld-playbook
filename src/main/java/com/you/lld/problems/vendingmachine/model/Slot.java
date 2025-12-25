package com.you.lld.problems.vendingmachine.model;

/**
 * Represents a slot in the vending machine that holds products.
 */
public class Slot {
    
    private final String code;
    private Product product;
    private int quantity;
    private final int maxCapacity;
    
    public Slot(String code, int maxCapacity) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be null or empty");
        }
        if (maxCapacity <= 0) {
            throw new IllegalArgumentException("Max capacity must be positive");
        }
        
        this.code = code;
        this.maxCapacity = maxCapacity;
        this.quantity = 0;
    }
    
    public Slot(String code, Product product, int quantity, int maxCapacity) {
        this(code, maxCapacity);
        this.product = product;
        this.quantity = Math.min(quantity, maxCapacity);
    }
    
    public String getCode() {
        return code;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public int getMaxCapacity() {
        return maxCapacity;
    }
    
    public boolean isEmpty() {
        return quantity <= 0 || product == null;
    }
    
    public boolean isFull() {
        return quantity >= maxCapacity;
    }
    
    public synchronized Product dispense() {
        if (isEmpty()) {
            throw new IllegalStateException("Slot " + code + " is empty");
        }
        quantity--;
        return product;
    }
    
    public synchronized void refill(Product product, int qty) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        this.product = product;
        this.quantity = Math.min(this.quantity + qty, maxCapacity);
    }
    
    public synchronized void setProduct(Product product, int quantity) {
        this.product = product;
        this.quantity = Math.min(quantity, maxCapacity);
    }
    
    @Override
    public String toString() {
        return String.format("Slot{code='%s', product=%s, quantity=%d/%d}", 
                           code, product != null ? product.getName() : "empty", quantity, maxCapacity);
    }
}
