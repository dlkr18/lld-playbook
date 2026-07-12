package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.model.Address;
import com.you.lld.problems.amazon.model.Order;
import com.you.lld.problems.amazon.model.Product;
import com.you.lld.problems.amazon.model.Review;

import java.math.BigDecimal;

/**
 * SDE3 demo: catalog, cart+checkout, order lifecycle, reviews, cancellation.
 */
public class AmazonDemo {

    public static void main(String[] args) {
        System.out.println("=== Amazon E-Commerce (SDE3) ===\n");
        Amazon amazon = new Amazon();
        Address addr = new Address("A1", "123 Main St", "SF", "CA", "94102", "USA");

        // 1. Product catalog
        System.out.println("--- 1. Catalog ---");
        Product laptop = new Product("P1", "MacBook Pro", new BigDecimal("2499.99"), "electronics", "s1");
        laptop.addStock(50);
        Product book = new Product("P3", "Design Patterns", new BigDecimal("49.99"), "books", "s2");
        book.addStock(200);
        amazon.addProduct(laptop);
        amazon.addProduct(book);
        System.out.println("Search MacBook: " + amazon.searchProducts("MacBook").size() + " hit(s)");

        // 2. Cart + checkout (Facade orchestrates cart → order)
        System.out.println("\n--- 2. Cart + checkout ---");
        amazon.addToCart("user-1", "P1", 1);
        amazon.addToCart("user-1", "P3", 2);
        String orderId = amazon.checkout("user-1", addr);
        Order order = amazon.getOrder(orderId);
        System.out.println("Order " + orderId + " total: $" + order.getTotalAmount());

        // 3. Order lifecycle (State-like transitions)
        System.out.println("\n--- 3. Order lifecycle ---");
        amazon.confirmOrder(orderId, "PAY-001");
        amazon.shipOrder(orderId, "TRACK-123");
        amazon.deliverOrder(orderId);
        System.out.println("Final status: " + amazon.getOrder(orderId).getStatus());

        // 4. Reviews
        System.out.println("\n--- 4. Reviews ---");
        amazon.addReview("P1", new Review("R1", "P1", "user-1", "Alice", 5, "Great", "Fast laptop"));
        System.out.println("Review added for MacBook Pro");

        // 5. Cancel pending order
        System.out.println("\n--- 5. Cancellation ---");
        amazon.addToCart("user-2", "P3", 1);
        String order2 = amazon.checkout("user-2", addr);
        boolean cancelled = amazon.cancelOrder(order2);
        System.out.println("Cancelled: " + cancelled + ", status=" + amazon.getOrder(order2).getStatus());

        System.out.println("\n=== Demo complete ===");
    }
}
