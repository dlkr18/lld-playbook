package com.you.lld.examples.day2.refactoring.before;

import java.sql.*;
import java.util.List;
import java.util.Date;

/**
 * BAD EXAMPLE: God Class - Does EVERYTHING!
 * 
 * This class violates multiple principles:
 * - Single Responsibility: Handles users, products, orders, payments, reporting
 * - Open/Closed: Hard to extend without modifying existing code
 * - Dependency Inversion: Depends on concrete implementations
 * 
 * Problems:
 * - Hard to test individual features
 * - Hard to maintain - changes affect multiple areas
 * - Hard to extend - adding features requires modifying existing code
 * - High coupling to databases, email, payment systems
 * - Low cohesion - unrelated responsibilities mixed together
 */
public class ECommerceManagerGodClass {
    
    // TOO MANY DEPENDENCIES
    private Connection dbConnection;
    private EmailSender emailSender;
    private PaymentGateway paymentGateway;
    private Logger logger;
    
    // USER MANAGEMENT (Should be separate)
    public void createUser(String name, String email, String password) {
        // Validation logic
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name required");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password too short");
        }
        
        // Password hashing
        String hashedPassword = hashPassword(password);
        
        // Database operations
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        try {
            PreparedStatement stmt = dbConnection.prepareStatement(sql);
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, hashedPassword);
            stmt.executeUpdate();
        } catch (SQLException e) {
            logger.error("Failed to create user", e);
            throw new RuntimeException("User creation failed");
        }
        
        // Email sending
        String subject = "Welcome to our store!";
        String body = "Hello " + name + ", welcome to our platform!";
        emailSender.send(email, subject, body);
        
        // Audit logging
        logger.info("User created: " + email);
    }
    
    // PRODUCT MANAGEMENT (Should be separate)
    public void addProduct(String name, double price, int quantity) {
        // Validation
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        
        // Database operations
        String sql = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)";
        try {
            PreparedStatement stmt = dbConnection.prepareStatement(sql);
            stmt.setString(1, name);
            stmt.setDouble(2, price);
            stmt.setInt(3, quantity);
            stmt.executeUpdate();
        } catch (SQLException e) {
            logger.error("Failed to add product", e);
            throw new RuntimeException("Product addition failed");
        }
        
        logger.info("Product added: " + name);
    }
    
    // ORDER PROCESSING (Should be separate)
    public void processOrder(int userId, List<OrderItem> items) {
        // Complex order processing logic with multiple responsibilities
        // User validation, inventory checking, price calculation, 
        // payment processing, order creation, inventory update, email confirmation
        // ... (hundreds of lines of mixed responsibilities)
    }
    
    // REPORTING (Should be separate)
    public void generateSalesReport(Date startDate, Date endDate) {
        // Complex SQL queries
        // Report generation logic
        // File writing logic
        // Email sending logic
    }
    
    // UTILITY METHODS (Mixed responsibilities)
    private String hashPassword(String password) {
        // Password hashing logic
        return password; // Simplified
    }
    
    private void validateEmail(String email) {
        // Email validation logic
    }
    
    private double calculateShipping(double weight, String zipCode) {
        // Shipping calculation logic
        return 0.0; // Simplified
    }
    
    // ... MANY MORE METHODS with mixed responsibilities
}

// Supporting classes for the example
class EmailSender {
    public void send(String to, String subject, String body) {}
}

class PaymentGateway {
    public PaymentResult charge(String email, double amount) { 
        return new PaymentResult(); 
    }
}

class PaymentResult {
    public boolean isSuccess() { return true; }
    public String getErrorMessage() { return ""; }
}

class Logger {
    public void error(String message, Exception e) {}
    public void info(String message) {}
}

class OrderItem {
    private int productId;
    private int quantity;
    
    public int getProductId() { return productId; }
    public int getQuantity() { return quantity; }
}

