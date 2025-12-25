package com.you.lld.problems.amazon.model;

import java.time.LocalDateTime;
import java.util.*;

public class Product {
    private final String productId;
    private String name;
    private String description;
    private ProductCategory category;
    private double price;
    private String brand;
    private int stockQuantity;
    private List<String> imageUrls;
    private List<Review> reviews;
    private double averageRating;
    private Set<String> tags;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String sellerId;
    
    public Product(String productId, String name, double price, String sellerId) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.sellerId = sellerId;
        this.category = ProductCategory.GENERAL;
        this.stockQuantity = 0;
        this.imageUrls = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.averageRating = 0.0;
        this.tags = new HashSet<>();
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public String getProductId() { return productId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public ProductCategory getCategory() { return category; }
    public double getPrice() { return price; }
    public String getBrand() { return brand; }
    public int getStockQuantity() { return stockQuantity; }
    public List<String> getImageUrls() { return new ArrayList<>(imageUrls); }
    public List<Review> getReviews() { return new ArrayList<>(reviews); }
    public double getAverageRating() { return averageRating; }
    public Set<String> getTags() { return new HashSet<>(tags); }
    public ProductStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getSellerId() { return sellerId; }
    
    // Setters
    public void setName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setCategory(ProductCategory category) {
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setPrice(double price) {
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        this.price = price;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setStockQuantity(int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Stock cannot be negative");
        this.stockQuantity = quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addStock(int quantity) {
        this.stockQuantity += quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void reduceStock(int quantity) {
        if (this.stockQuantity < quantity) {
            throw new IllegalStateException("Insufficient stock");
        }
        this.stockQuantity -= quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInStock() {
        return stockQuantity > 0 && status == ProductStatus.ACTIVE;
    }
    
    public void addImage(String imageUrl) {
        imageUrls.add(imageUrl);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addReview(Review review) {
        reviews.add(review);
        recalculateAverageRating();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addTag(String tag) {
        tags.add(tag);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setStatus(ProductStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    private void recalculateAverageRating() {
        if (reviews.isEmpty()) {
            averageRating = 0.0;
            return;
        }
        double sum = reviews.stream().mapToDouble(Review::getRating).sum();
        averageRating = sum / reviews.size();
    }
}
