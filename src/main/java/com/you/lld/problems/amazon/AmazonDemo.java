package com.you.lld.problems.amazon;
import com.you.lld.problems.amazon.api.*;
import com.you.lld.problems.amazon.impl.*;
import com.you.lld.problems.amazon.model.*;
import java.util.*;

public class AmazonDemo {
    public static void main(String[] args) {
        System.out.println("=== Amazon E-commerce System Demo ===\n");
        
        AmazonService amazon = new InMemoryAmazonService();
        
        // Register customers
        Customer john = amazon.registerCustomer("John Doe", "john@example.com");
        john.setPrime(true);
        Address johnAddress = new Address("123 Main St", "New York", "NY", "10001", "USA");
        john.addAddress(johnAddress);
        amazon.updateCustomer(john);
        
        System.out.println("✅ Registered customer: " + john.getName());
        System.out.println("   Prime member: " + john.isPrime());
        
        // Add products
        Product laptop = new Product("P001", "MacBook Pro", 1999.99, "SELLER001");
        laptop.setCategory(ProductCategory.ELECTRONICS);
        laptop.setDescription("14-inch, M2 Pro");
        laptop.setStockQuantity(50);
        amazon.addProduct(laptop);
        
        Product book = new Product("P002", "Design Patterns", 49.99, "SELLER002");
        book.setCategory(ProductCategory.BOOKS);
        book.setStockQuantity(100);
        amazon.addProduct(book);
        
        System.out.println("\n📦 Added products:");
        System.out.println("   - " + laptop.getName() + " ($" + laptop.getPrice() + ")");
        System.out.println("   - " + book.getName() + " ($" + book.getPrice() + ")");
        
        // Add to cart
        amazon.addToCart(john.getCustomerId(), laptop.getProductId(), 1);
        amazon.addToCart(john.getCustomerId(), book.getProductId(), 2);
        
        Cart cart = amazon.getCart(john.getCustomerId());
        System.out.println("\n🛒 Cart total: $" + String.format("%.2f", cart.getTotalAmount()));
        System.out.println("   Items: " + cart.getItems().size());
        
        // Place order
        Order order = amazon.placeOrder(john.getCustomerId(), cart.getCartId(), 
                                       johnAddress, PaymentMethod.CREDIT_CARD);
        
        System.out.println("\n✅ Order placed successfully!");
        System.out.println("   Order ID: " + order.getOrderId());
        System.out.println("   Status: " + order.getStatus());
        System.out.println("   Total: $" + String.format("%.2f", order.getTotalAmount()));
        
        // Update order status
        amazon.updateOrderStatus(order.getOrderId(), OrderStatus.SHIPPED);
        order.setTrackingNumber("TRACK123456");
        System.out.println("\n📮 Order shipped - Tracking: " + order.getTrackingNumber());
        
        // Add review
        Review review = amazon.addReview(laptop.getProductId(), john.getCustomerId(), 5, 
                                        "Excellent laptop! Very fast.");
        review.setTitle("Best laptop ever!");
        
        System.out.println("\n⭐ Review added:");
        System.out.println("   Rating: " + review.getRating() + "/5");
        System.out.println("   " + review.getComment());
        
        // Search
        List<Product> results = amazon.searchProducts("MacBook");
        System.out.println("\n🔍 Search results for 'MacBook': " + results.size() + " found");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}
