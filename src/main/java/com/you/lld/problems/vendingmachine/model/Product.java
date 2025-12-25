package com.you.lld.problems.vendingmachine.model;

import java.util.Objects;

/**
 * Represents a product that can be sold in the vending machine.
 * Immutable value object.
 */
public final class Product {
    
    private final String id;
    private final String name;
    private final Money price;
    private final ProductCategory category;
    
    public Product(String id, String name, Money price, ProductCategory category) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
        if (price == null || price.isZero()) {
            throw new IllegalArgumentException("Product price must be positive");
        }
        if (category == null) {
            throw new IllegalArgumentException("Product category cannot be null");
        }
        
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public Money getPrice() {
        return price;
    }
    
    public ProductCategory getCategory() {
        return category;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Product product = (Product) obj;
        return Objects.equals(id, product.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return String.format("Product{id='%s', name='%s', price=%s, category=%s}", 
                           id, name, price, category);
    }
}
