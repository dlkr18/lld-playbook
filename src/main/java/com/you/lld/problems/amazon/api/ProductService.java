package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.util.List;

public interface ProductService {
    String addProduct(Product product);
    Product getProduct(String productId);
    List<Product> searchProducts(String keyword);
    List<Product> getProductsByCategory(String categoryId);
    List<Product> getProductsBySeller(String sellerId);
    void updateProduct(String productId, Product updatedProduct);
    void updateStock(String productId, int quantity);
    void deleteProduct(String productId);
    
    // Review operations
    String addReview(String productId, Review review);
    List<Review> getProductReviews(String productId);
}

