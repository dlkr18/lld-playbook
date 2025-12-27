package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Product {
    private final String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryId;
    private String sellerId;
    private int stockQuantity;
    private double rating;
    private int reviewCount;
    private List<String> images;
    private Map<String, String> specifications;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Product(String id, String name, BigDecimal price, String categoryId, String sellerId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.stockQuantity = 0;
        this.rating = 0.0;
        this.reviewCount = 0;
        this.images = new ArrayList<>();
        this.specifications = new HashMap<>();
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInStock() {
        return stockQuantity > 0 && status == ProductStatus.ACTIVE;
    }
    
    public boolean canFulfillQuantity(int quantity) {
        return stockQuantity >= quantity;
    }
    
    public void reduceStock(int quantity) {
        if (quantity > stockQuantity) {
            throw new IllegalStateException("Insufficient stock");
        }
        this.stockQuantity -= quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addStock(int quantity) {
        this.stockQuantity += quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateRating(double newRating) {
        this.rating = ((this.rating * this.reviewCount) + newRating) / (this.reviewCount + 1);
        this.reviewCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getCategoryId() { return categoryId; }
    public String getSellerId() { return sellerId; }
    public int getStockQuantity() { return stockQuantity; }
    public double getRating() { return rating; }
    public int getReviewCount() { return reviewCount; }
    public List<String> getImages() { return new ArrayList<>(images); }
    public Map<String, String> getSpecifications() { return new HashMap<>(specifications); }
    public ProductStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setStatus(ProductStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addImage(String imageUrl) {
        this.images.add(imageUrl);
    }
    
    public void addSpecification(String key, String value) {
        this.specifications.put(key, value);
    }
    
    @Override
    public String toString() {
        return "Product{id='" + id + "', name='" + name + "', price=" + price + 
               ", stock=" + stockQuantity + ", rating=" + rating + "}";
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id.equals(product.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
