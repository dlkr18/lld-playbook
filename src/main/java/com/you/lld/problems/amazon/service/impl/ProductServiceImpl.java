package com.you.lld.problems.amazon.service.impl;

import com.you.lld.problems.amazon.service.ProductService;
import com.you.lld.problems.amazon.exceptions.ProductNotFoundException;
import com.you.lld.problems.amazon.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

public class ProductServiceImpl implements ProductService {
    private final Map<String, Product> products = new ConcurrentHashMap<>();
    private final Map<String, List<Review>> productReviews = new ConcurrentHashMap<>();
    
    @Override
    public String addProduct(Product product) {
        products.put(product.getId(), product);
        productReviews.put(product.getId(), new CopyOnWriteArrayList<>());
        return product.getId();
    }
    
    @Override
    public Product getProduct(String productId) {
        return products.get(productId);
    }
    
    @Override
    public List<Product> searchProducts(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return products.values().stream()
            .filter(p -> p.getName().toLowerCase().contains(lowerKeyword) ||
                        (p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerKeyword)))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getProductsByCategory(String categoryId) {
        return products.values().stream()
            .filter(p -> p.getCategoryId().equals(categoryId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getProductsBySeller(String sellerId) {
        return products.values().stream()
            .filter(p -> p.getSellerId().equals(sellerId))
            .collect(Collectors.toList());
    }
    
    @Override
    public void updateProduct(String productId, Product updatedProduct) {
        if (products.containsKey(productId)) {
            products.put(productId, updatedProduct);
        }
    }
    
    @Override
    public void updateStock(String productId, int quantity) {
        Product product = products.get(productId);
        if (product != null) {
            if (quantity >= 0) {
                product.addStock(quantity);
            } else {
                product.reduceStock(Math.abs(quantity));
            }
        }
    }
    
    @Override
    public void deleteProduct(String productId) {
        // Soft delete: removing from the map first made the status change invisible,
        // and orphaned any Order still referencing the product.
        Product product = products.get(productId);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        product.setStatus(ProductStatus.DISCONTINUED);
    }
    
    @Override
    public String addReview(String productId, Review review) {
        Product product = products.get(productId);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        
        // CopyOnWriteArrayList: reviews are read-often, written-rarely, and a plain
        // ArrayList inside a ConcurrentHashMap loses concurrent adds.
        List<Review> reviews = productReviews.computeIfAbsent(productId, k -> new CopyOnWriteArrayList<>());
        reviews.add(review);
        product.updateRating(review.getRating());
        
        return review.getId();
    }
    
    @Override
    public List<Review> getProductReviews(String productId) {
        return new ArrayList<>(productReviews.getOrDefault(productId, Collections.emptyList()));
    }
}

