package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import com.you.lld.problems.amazon.exceptions.InsufficientStockException;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.*;

public class Product {
    private final String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryId;
    private String sellerId;
    private final AtomicInteger stockQuantity = new AtomicInteger(0);
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
        this.rating = 0.0;
        this.reviewCount = 0;
        this.images = new ArrayList<>();
        this.specifications = new HashMap<>();
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInStock() {
        return stockQuantity.get() > 0 && status == ProductStatus.ACTIVE;
    }
    
    public boolean canFulfillQuantity(int quantity) {
        return stockQuantity.get() >= quantity;
    }
    
    /**
     * Atomically reserves {@code quantity} units, or returns false if there are not
     * enough. A check-then-act (`if (q > stock) throw; stock -= q;`) lets every
     * concurrent buyer pass the check and oversell the last unit — so the compare
     * and the decrement have to be one CAS.
     */
    public boolean tryReserve(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Reserve quantity must be positive");
        }
        while (true) {
            int current = stockQuantity.get();
            if (current < quantity) {
                return false;
            }
            if (stockQuantity.compareAndSet(current, current - quantity)) {
                this.updatedAt = LocalDateTime.now();
                return true;
            }
        }
    }

    /** Returns reserved units to stock (checkout rollback, order cancellation). */
    public void releaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Release quantity must be positive");
        }
        stockQuantity.addAndGet(quantity);
        this.updatedAt = LocalDateTime.now();
    }

    public void reduceStock(int quantity) {
        if (!tryReserve(quantity)) {
            throw new InsufficientStockException(
                    "Insufficient stock for " + name + ": requested " + quantity
                            + ", available " + stockQuantity.get());
        }
    }
    
    public void addStock(int quantity) {
        stockQuantity.addAndGet(quantity);
        this.updatedAt = LocalDateTime.now();
    }
    
    /** Synchronized: the running average is a read-modify-write over two fields. */
    public synchronized void updateRating(double newRating) {
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
    public int getStockQuantity() { return stockQuantity.get(); }
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
