package com.you.lld.problems.amazon.model;
import java.util.*;

public class Cart {
    private final String cartId;
    private final String userId;
    private Map<String, CartItem> items; // productId -> CartItem
    private double totalAmount;
    
    public Cart(String cartId, String userId) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = new HashMap<>();
        this.totalAmount = 0.0;
    }
    
    public String getCartId() { return cartId; }
    public String getUserId() { return userId; }
    public Map<String, CartItem> getItems() { return new HashMap<>(items); }
    public double getTotalAmount() { return totalAmount; }
    
    public void addItem(CartItem item) {
        if (items.containsKey(item.getProductId())) {
            CartItem existing = items.get(item.getProductId());
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
        } else {
            items.put(item.getProductId(), item);
        }
        recalculateTotal();
    }
    
    public void removeItem(String productId) {
        items.remove(productId);
        recalculateTotal();
    }
    
    public void updateQuantity(String productId, int quantity) {
        CartItem item = items.get(productId);
        if (item != null) {
            if (quantity <= 0) {
                removeItem(productId);
            } else {
                item.setQuantity(quantity);
                recalculateTotal();
            }
        }
    }
    
    public void clear() {
        items.clear();
        totalAmount = 0.0;
    }
    
    private void recalculateTotal() {
        totalAmount = items.values().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }
}
