package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Cart {
    private final String userId;
    private final Map<String, CartItem> items;
    private BigDecimal totalAmount;
    
    public Cart(String userId) {
        this.userId = userId;
        this.items = new ConcurrentHashMap<>();
        this.totalAmount = BigDecimal.ZERO;
    }
    
    public synchronized void addItem(Product product, int quantity) {
        if (!product.isInStock()) {
            throw new IllegalStateException("Product is out of stock");
        }
        
        if (!product.canFulfillQuantity(quantity)) {
            throw new IllegalStateException("Requested quantity not available");
        }
        
        String productId = product.getId();
        CartItem existing = items.get(productId);
        
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            items.put(productId, new CartItem(productId, product.getName(), 
                                             product.getPrice(), quantity));
        }
        
        recalculateTotal();
    }
    
    public synchronized void removeItem(String productId) {
        items.remove(productId);
        recalculateTotal();
    }
    
    public synchronized void updateQuantity(String productId, int quantity) {
        CartItem item = items.get(productId);
        if (item != null) {
            if (quantity <= 0) {
                items.remove(productId);
            } else {
                item.setQuantity(quantity);
            }
            recalculateTotal();
        }
    }
    
    public synchronized void clear() {
        items.clear();
        totalAmount = BigDecimal.ZERO;
    }
    
    private void recalculateTotal() {
        totalAmount = items.values().stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    public String getUserId() { return userId; }
    public Map<String, CartItem> getItems() { return new HashMap<>(items); }
    public BigDecimal getTotalAmount() { return totalAmount; }
    
    @Override
    public String toString() {
        return "Cart{userId='" + userId + "', items=" + items.size() + 
               ", total=" + totalAmount + "}";
    }
}
