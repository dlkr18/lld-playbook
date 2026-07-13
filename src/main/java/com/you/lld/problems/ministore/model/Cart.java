package com.you.lld.problems.ministore.model;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A customer's cart, bound to exactly ONE store — because an order can only be placed
 * against a single store, the cart enforces that boundary from the start. Adding a
 * product from another store is a programming/user error caught upstream (the platform
 * only ever hands this cart products it already verified belong to {@code storeId}).
 *
 * Quantities are merged per product (adding the same product twice sums the qty).
 */
public final class Cart {

    private final String storeId;
    private final String customerId;
    private final Map<String, Integer> quantities = new LinkedHashMap<String, Integer>();

    public Cart(String storeId, String customerId) {
        this.storeId = storeId;
        this.customerId = customerId;
    }

    public String storeId() { return storeId; }
    public String customerId() { return customerId; }

    public void addItem(String productId, int qty) {
        if (qty <= 0) throw new IllegalArgumentException("quantity must be positive");
        Integer current = quantities.get(productId);
        quantities.put(productId, (current == null ? 0 : current) + qty);
    }

    /** Set an absolute quantity; 0 removes the line. */
    public void setItem(String productId, int qty) {
        if (qty < 0) throw new IllegalArgumentException("quantity cannot be negative");
        if (qty == 0) quantities.remove(productId);
        else quantities.put(productId, qty);
    }

    public void removeItem(String productId) { quantities.remove(productId); }
    public void clear() { quantities.clear(); }
    public boolean isEmpty() { return quantities.isEmpty(); }

    public List<CartLine> lines() {
        List<CartLine> out = new ArrayList<CartLine>();
        for (Map.Entry<String, Integer> e : quantities.entrySet()) {
            out.add(new CartLine(e.getKey(), e.getValue()));
        }
        return out;
    }
}
