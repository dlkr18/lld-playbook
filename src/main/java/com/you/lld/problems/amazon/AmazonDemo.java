package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.impl.OrderServiceImpl;
import com.you.lld.problems.amazon.impl.ProductServiceImpl;
import com.you.lld.problems.amazon.model.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Demo: Amazon-like e-commerce with product catalog, orders, reviews.
 */
public class AmazonDemo {

    public static void main(String[] args) {
        System.out.println("=== Amazon E-Commerce Demo ===\n");

        ProductServiceImpl productService = new ProductServiceImpl();
        OrderServiceImpl orderService = new OrderServiceImpl();

        // --- Add products ---
        System.out.println("--- Product catalog ---");
        Product laptop = new Product("P1", "MacBook Pro", new BigDecimal("2499.99"), "electronics", "seller-1");
        laptop.setDescription("Apple MacBook Pro 16-inch");
        laptop.addStock(50);

        Product phone = new Product("P2", "iPhone 15", new BigDecimal("999.99"), "electronics", "seller-1");
        phone.addStock(100);

        Product book = new Product("P3", "Design Patterns", new BigDecimal("49.99"), "books", "seller-2");
        book.addStock(200);

        productService.addProduct(laptop);
        productService.addProduct(phone);
        productService.addProduct(book);
        System.out.println("Added 3 products");

        // --- Search ---
        System.out.println("\n--- Search ---");
        List<Product> results = productService.searchProducts("MacBook");
        System.out.println("Search 'MacBook': " + results.size() + " results");
        for (Product p : results) {
            System.out.println("  " + p);
        }

        results = productService.getProductsByCategory("electronics");
        System.out.println("Electronics: " + results.size() + " products");

        // --- Reviews ---
        System.out.println("\n--- Reviews ---");
        Review r1 = new Review("R1", "P1", "user-1", "Alice", 5, "Amazing!", "Best laptop ever");
        Review r2 = new Review("R2", "P1", "user-2", "Bob", 4, "Great", "Very fast, a bit heavy");
        productService.addReview("P1", r1);
        productService.addReview("P1", r2);

        List<Review> reviews = productService.getProductReviews("P1");
        System.out.println("MacBook reviews: " + reviews.size());
        for (Review r : reviews) {
            System.out.println("  " + r.getUserName() + ": " + r.getRating() + "/5 - " + r.getTitle());
        }

        // --- Place order ---
        System.out.println("\n--- Order ---");
        OrderItem item1 = new OrderItem("P1", "MacBook Pro", new BigDecimal("2499.99"), 1);
        OrderItem item2 = new OrderItem("P3", "Design Patterns", new BigDecimal("49.99"), 2);
        Address addr = new Address("A1", "123 Main St", "San Francisco", "CA", "94102", "USA");

        String orderId = orderService.createOrder("user-1", Arrays.asList(item1, item2), addr);
        System.out.println("Order placed: " + orderId);

        Order order = orderService.getOrder(orderId);
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Order total: $" + order.getTotalAmount());

        // --- Order lifecycle ---
        System.out.println("\n--- Order lifecycle ---");
        orderService.confirmOrder(orderId, "PAY-001");
        System.out.println("After confirm: " + orderService.getOrder(orderId).getStatus());

        orderService.shipOrder(orderId, "TRACK-123");
        System.out.println("After ship: " + orderService.getOrder(orderId).getStatus());

        orderService.deliverOrder(orderId);
        System.out.println("After deliver: " + orderService.getOrder(orderId).getStatus());

        // --- Order history ---
        System.out.println("\n--- Order history ---");
        List<Order> history = orderService.getUserOrders("user-1");
        System.out.println("user-1 orders: " + history.size());

        // --- Cancel ---
        String orderId2 = orderService.createOrder("user-2", 
            Arrays.asList(new OrderItem("P2", "iPhone", new BigDecimal("999.99"), 1)), addr);
        boolean cancelled = orderService.cancelOrder(orderId2);
        System.out.println("Cancel new order: " + cancelled + ", status: " 
            + orderService.getOrder(orderId2).getStatus());

        // --- Stock update ---
        System.out.println("\n--- Stock ---");
        productService.updateStock("P1", 45);
        System.out.println("Updated MacBook stock: " + productService.getProduct("P1").getStockQuantity());

        System.out.println("\n=== Demo complete ===");
    }
}
