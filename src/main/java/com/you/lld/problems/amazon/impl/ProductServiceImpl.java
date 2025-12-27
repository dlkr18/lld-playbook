package com.you.lld.problems.amazon.impl;

import com.you.lld.problems.amazon.api.ProductService;
import com.you.lld.problems.amazon.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ProductServiceImpl implements ProductService {
    private final Map<String, Product> products = new ConcurrentHashMap<>();
    private final Map<String, List<Review>> productReviews = new ConcurrentHashMap<>();
    
    @Override
    public String addProduct(Product product) {
        products.put(product.getId(), product);
        productReviews.put(product.getId(), new ArrayList<>());
        System.out.println("Product added: " + product.getId());
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
            System.out.println("Product updated: " + productId);
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
        Product product = products.remove(productId);
        if (product != null) {
            product.setStatus(ProductStatus.DISCONTINUED);
            System.out.println("Product deleted: " + productId);
        }
    }
    
    @Override
    public String addReview(String productId, Review review) {
        Product product = products.get(productId);
        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        
        List<Review> reviews = productReviews.computeIfAbsent(productId, k -> new ArrayList<>());
        reviews.add(review);
        product.updateRating(review.getRating());
        
        System.out.println("Review added for product: " + productId);
        return review.getId();
    }
    
    @Override
    public List<Review> getProductReviews(String productId) {
        return new ArrayList<>(productReviews.getOrDefault(productId, Collections.emptyList()));
    }
}

