package com.you.lld.problems.amazon.impl;

import com.you.lld.problems.amazon.api.CartService;
import com.you.lld.problems.amazon.model.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory cart service.
 * Each user has their own Cart; concurrent operations on different carts are safe.
 */
public class CartServiceImpl implements CartService {

    private final Map<String, Cart> carts = new ConcurrentHashMap<>();
    private final ProductServiceImpl productService;

    public CartServiceImpl(ProductServiceImpl productService) {
        this.productService = productService;
    }

    @Override
    public Cart getCart(String userId) {
        return carts.computeIfAbsent(userId, Cart::new);
    }

    @Override
    public void addToCart(String userId, String productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
        Product product = productService.getProduct(productId);
        if (product == null) throw new IllegalArgumentException("Product not found: " + productId);
        Cart cart = getCart(userId);
        cart.addItem(product, quantity);
    }

    @Override
    public void removeFromCart(String userId, String productId) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.removeItem(productId);
        }
    }

    @Override
    public void updateQuantity(String userId, String productId, int quantity) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.updateQuantity(productId, quantity);
        }
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.clear();
        }
    }

    @Override
    public BigDecimal getCartTotal(String userId) {
        Cart cart = carts.get(userId);
        return cart != null ? cart.getTotalAmount() : BigDecimal.ZERO;
    }
}
