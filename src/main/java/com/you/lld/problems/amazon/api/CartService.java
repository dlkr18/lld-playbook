package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.math.BigDecimal;

public interface CartService {
    Cart getCart(String userId);
    void addToCart(String userId, String productId, int quantity);
    void removeFromCart(String userId, String productId);
    void updateQuantity(String userId, String productId, int quantity);
    void clearCart(String userId);
    BigDecimal getCartTotal(String userId);
}

