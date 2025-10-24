package com.you.lld.examples.week2.day6;

import com.you.lld.examples.week2.day6.builder.SqlQueryBuilder;
import com.you.lld.examples.week2.day6.builder.User;
import com.you.lld.examples.week2.day6.factory.*;
import com.you.lld.examples.week2.day6.prototype.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * Comprehensive demonstration of all three creational patterns.
 * 
 * This class shows practical usage of:
 * - Builder Pattern: Complex object construction
 * - Factory Pattern: Object creation based on type
 * - Prototype Pattern: Cloning expensive objects
 */
public class CreationalPatternsDemo {
    
    public static void main(String[] args) {
        System.out.println("=== CREATIONAL PATTERNS DEMONSTRATION ===\n");
        
        demonstrateBuilderPattern();
        System.out.println("\n" + "==================================================\n");
        
        demonstrateFactoryPattern();
        System.out.println("\n" + "==================================================\n");
        
        demonstratePrototypePattern();
    }
    
    /**
     * Demonstrate the Builder pattern with User and SQL Query builders.
     */
    private static void demonstrateBuilderPattern() {
        System.out.println("🔨 BUILDER PATTERN DEMONSTRATION");
        System.out.println("Solving the telescoping constructor problem with fluent interfaces\n");
        
        // Example 1: User Builder
        System.out.println("1. User Builder Example:");
        
        try {
            // Build a simple user
            User simpleUser = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .build();
            
            System.out.println("Simple User: " + simpleUser);
            
            // Build a complex user with all optional fields
            User complexUser = User.builder()
                    .name("Jane Smith")
                    .email("jane@example.com")
                    .age(28)
                    .phone("555-0123")
                    .address("123 Main St, Anytown, USA")
                    .addPreference("Dark Mode")
                    .addPreference("Email Notifications")
                    .addPreference("Two-Factor Auth")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            System.out.println("Complex User: " + complexUser);
            
            // Demonstrate validation
            try {
                User.builder()
                        .name("") // Invalid empty name
                        .email("invalid-email") // Invalid email format
                        .build();
            } catch (IllegalStateException e) {
                System.out.println("Validation caught: " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        System.out.println();
        
        // Example 2: SQL Query Builder
        System.out.println("2. SQL Query Builder Example:");
        
        // Simple SELECT query
        SqlQueryBuilder.PreparedQuery selectQuery = SqlQueryBuilder.select()
                .columns("id", "name", "email")
                .from("users")
                .where("age > ?")
                .withParameter(18)
                .orderBy("name", SqlQueryBuilder.SortOrder.ASC)
                .limit(10)
                .build();
        
        System.out.println("SELECT Query: " + selectQuery.getSql());
        System.out.println("Parameters: " + selectQuery.getParameters());
        
        // Complex JOIN query
        SqlQueryBuilder.PreparedQuery joinQuery = SqlQueryBuilder.select()
                .columns("u.name", "p.title", "c.name as category")
                .from("users u")
                .innerJoin("posts p", "u.id = p.user_id")
                .leftJoin("categories c", "p.category_id = c.id")
                .where("u.active = ?")
                .and("p.published_at > ?")
                .withParameters(true, "2024-01-01")
                .orderBy("p.published_at", SqlQueryBuilder.SortOrder.DESC)
                .build();
        
        System.out.println("JOIN Query: " + joinQuery.getSql());
        System.out.println("Parameters: " + joinQuery.getParameters());
        
        // INSERT query
        SqlQueryBuilder.PreparedQuery insertQuery = SqlQueryBuilder.insert()
                .into("users")
                .values("name", "email", "age")
                .withParameters("Alice Johnson", "alice@example.com", 25)
                .build();
        
        System.out.println("INSERT Query: " + insertQuery.getSql());
        System.out.println("Parameters: " + insertQuery.getParameters());
    }
    
    /**
     * Demonstrate the Factory pattern with payment processors.
     */
    private static void demonstrateFactoryPattern() {
        System.out.println("🏭 FACTORY PATTERN DEMONSTRATION");
        System.out.println("Encapsulating object creation logic and supporting multiple implementations\n");
        
        // Example 1: Basic Factory Usage
        System.out.println("1. Basic Payment Processor Creation:");
        
        PaymentMethod[] methods = {
            PaymentMethod.CREDIT_CARD,
            PaymentMethod.PAYPAL,
            PaymentMethod.BANK_TRANSFER
        };
        
        for (PaymentMethod method : methods) {
            if (PaymentProcessorFactory.isSupported(method)) {
                PaymentProcessor processor = PaymentProcessorFactory.createProcessor(method);
                System.out.printf("Created %s processor: %s%n", 
                                method.getDisplayName(), 
                                processor.getClass().getSimpleName());
            }
        }
        
        System.out.println("\nSupported payment methods: " + 
                          Arrays.toString(PaymentProcessorFactory.getSupportedPaymentMethods()));
        
        // Example 2: Processing Payments
        System.out.println("\n2. Payment Processing Examples:");
        
        // Credit Card Payment
        try {
            PaymentProcessor ccProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            
            PaymentDetails ccDetails = new PaymentDetails();
            ccDetails.setCardNumber("4111 1111 1111 1111"); // Test Visa number
            ccDetails.setExpiryDate("12/25");
            ccDetails.setCvv("123");
            ccDetails.setCardHolderName("John Doe");
            
            PaymentResult result = ccProcessor.processPayment(
                new BigDecimal("99.99"), 
                "USD", 
                ccDetails
            );
            
            System.out.println("Credit Card Payment: " + 
                             (result.isSuccess() ? "SUCCESS" : "FAILED"));
            System.out.println("Transaction ID: " + result.getTransactionId());
            System.out.println("Processing Fee: $" + result.getProcessingFee());
            
        } catch (PaymentException e) {
            System.out.println("Payment failed: " + e.getMessage());
        }
        
        // PayPal Payment
        try {
            PaymentProcessor paypalProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);
            
            PaymentDetails paypalDetails = new PaymentDetails();
            paypalDetails.setPayPalEmail("user@example.com");
            
            PaymentResult result = paypalProcessor.processPayment(
                new BigDecimal("49.99"), 
                "USD", 
                paypalDetails
            );
            
            System.out.println("PayPal Payment: " + 
                             (result.isSuccess() ? "SUCCESS" : "FAILED"));
            System.out.println("Transaction ID: " + result.getTransactionId());
            System.out.println("Processing Fee: $" + result.getProcessingFee());
            
        } catch (PaymentException e) {
            System.out.println("PayPal payment failed: " + e.getMessage());
        }
        
        // Example 3: Optimal Processor Selection
        System.out.println("\n3. Intelligent Processor Selection:");
        
        PaymentMethod[] availableMethods = {
            PaymentMethod.CREDIT_CARD, 
            PaymentMethod.PAYPAL, 
            PaymentMethod.BANK_TRANSFER
        };
        
        // Small amount - should prefer digital wallets (but we don't have them implemented)
        PaymentProcessor smallAmountProcessor = PaymentProcessorFactory.createOptimalProcessor(
            new BigDecimal("25.00"), 
            "USD", 
            availableMethods
        );
        System.out.println("For $25: Recommended " + 
                          smallAmountProcessor.getSupportedPaymentMethod().getDisplayName());
        
        // Large amount - should prefer credit cards
        PaymentProcessor largeAmountProcessor = PaymentProcessorFactory.createOptimalProcessor(
            new BigDecimal("1500.00"), 
            "USD", 
            availableMethods
        );
        System.out.println("For $1500: Recommended " + 
                          largeAmountProcessor.getSupportedPaymentMethod().getDisplayName());
    }
    
    /**
     * Demonstrate the Prototype pattern with game characters.
     */
    private static void demonstratePrototypePattern() {
        System.out.println("🧬 PROTOTYPE PATTERN DEMONSTRATION");
        System.out.println("Cloning expensive objects instead of creating from scratch\n");
        
        // Create character registry
        CharacterRegistry registry = new CharacterRegistry();
        
        // Example 1: Basic Character Creation
        System.out.println("1. Basic Character Creation from Prototypes:");
        
        System.out.println("Available prototypes: " + registry.getAvailablePrototypes());
        
        GameCharacter warrior1 = registry.createCharacter("warrior", "Conan the Barbarian");
        GameCharacter warrior2 = registry.createCharacter("warrior", "Aragorn", 10);
        GameCharacter mage1 = registry.createCharacter("mage", "Gandalf the Grey");
        
        System.out.println("Created: " + warrior1);
        System.out.println("Created: " + warrior2);
        System.out.println("Created: " + mage1);
        
        // Example 2: Specialized Characters
        System.out.println("\n2. Specialized Character Creation:");
        
        GameCharacter berserker = registry.createCharacter("berserker", "Bjorn Ironside");
        GameCharacter fireMage = registry.createCharacter("fire_mage", "Pyro Pete");
        GameCharacter eliteWarrior = registry.createCharacter("elite_warrior", "Sir Lancelot");
        
        System.out.println("Created: " + berserker);
        System.out.println("Created: " + fireMage);
        System.out.println("Created: " + eliteWarrior);
        
        // Example 3: Mass Character Creation
        System.out.println("\n3. Mass Character Creation:");
        
        String[] npcNames = {"Guard1", "Guard2", "Guard3", "Merchant", "Blacksmith"};
        GameCharacter[] npcs = registry.createMultipleCharacters("warrior", npcNames);
        
        System.out.println("Created " + npcs.length + " NPC warriors:");
        for (GameCharacter npc : npcs) {
            System.out.println("  - " + npc.getName() + " (Level " + npc.getLevel() + ")");
        }
        
        // Example 4: Character Customization
        System.out.println("\n4. Character Customization After Cloning:");
        
        GameCharacter baseMage = registry.createCharacter("mage", "Apprentice Mage");
        System.out.println("Base mage: " + baseMage);
        System.out.println("Base mage skills: " + baseMage.getSkills());
        
        // Clone and customize
        Mage customMage = (Mage) baseMage.clone();
        customMage.setName("Master Elementalist");
        customMage.levelUpTo(15);
        customMage.addSkill(new GameCharacter.Skill("Summon Elemental", "Summons an elemental ally", 3));
        customMage.getEquipment().setWeapon("Staff of the Elements");
        
        System.out.println("Customized mage: " + customMage);
        System.out.println("Custom mage skills: " + customMage.getSkills());
        
        // Verify original wasn't affected
        System.out.println("Original mage unchanged: " + baseMage);
        
        // Example 5: Performance Demonstration
        System.out.println("\n5. Performance Comparison:");
        registry.demonstratePerformance();
        
        // Example 6: Custom Prototype Registration
        System.out.println("\n6. Custom Prototype Registration:");
        
        // Create a custom character
        Warrior customWarrior = new Warrior("Custom Template");
        customWarrior.levelUpTo(15);
        customWarrior.getEquipment().setWeapon("Excalibur");
        customWarrior.getEquipment().setArmor("Enchanted Plate");
        customWarrior.addSkill(new GameCharacter.Skill("Holy Strike", "Divine damage attack", 5));
        customWarrior.setAttribute("alignment", "Lawful Good");
        
        // Register as new prototype
        registry.registerPrototype("paladin", customWarrior);
        
        // Use the new prototype
        GameCharacter paladin1 = registry.createCharacter("paladin", "Sir Galahad");
        GameCharacter paladin2 = registry.createCharacter("paladin", "Joan of Arc", 20);
        
        System.out.println("Created custom paladin: " + paladin1);
        System.out.println("Created high-level paladin: " + paladin2);
        System.out.println("Updated prototype count: " + registry.getPrototypeCount());
    }
}
