package com.you.lld.problems.ministore.model;

/**
 * Immutable catalog entry. Carries its owning {@code storeId} — this field is the
 * backbone of tenant isolation: every lookup checks the product belongs to the
 * requesting store, so products are never shared across tenants.
 *
 * Note the deliberate split: Product holds the *immutable* catalog facts (name,
 * price); the *mutable* stock count lives in {@link InventoryItem}. Price and name
 * don't change when a unit is sold — so they don't belong on the same object.
 */
public final class Product {

    private final String id;
    private final String storeId;
    private final String name;
    private final Money price;

    public Product(String id, String storeId, String name, Money price) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("product id required");
        if (storeId == null || storeId.trim().isEmpty()) throw new IllegalArgumentException("storeId required");
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("product name required");
        if (price == null) throw new IllegalArgumentException("price required");
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.price = price;
    }

    public String id() { return id; }
    public String storeId() { return storeId; }
    public String name() { return name; }
    public Money price() { return price; }

    @Override
    public String toString() { return "Product{" + id + ", " + name + ", " + price + ", store=" + storeId + "}"; }
}
