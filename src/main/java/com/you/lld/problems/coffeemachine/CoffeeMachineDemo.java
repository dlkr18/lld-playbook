package com.you.lld.problems.coffeemachine;

import com.you.lld.problems.coffeemachine.impl.CoffeeMachineImpl;
import com.you.lld.problems.coffeemachine.model.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Demo: Coffee Machine with menu, ordering, payment, ingredient management.
 */
public class CoffeeMachineDemo {

    public static void main(String[] args) {
        System.out.println("=== Coffee Machine Demo ===\n");

        CoffeeMachineImpl machine = new CoffeeMachineImpl();

        // View menu
        System.out.println("--- Menu ---");
        List<com.you.lld.problems.coffeemachine.model.Beverage> menu = machine.getMenu();
        for (com.you.lld.problems.coffeemachine.model.Beverage b : menu) {
            System.out.println("  " + b.getName() + " - $" + b.getPrice());
        }

        // Check ingredients
        System.out.println("\n--- Ingredients ---");
        Map<com.you.lld.problems.coffeemachine.model.Ingredient, Integer> ingredients = 
            machine.checkIngredients();
        for (Map.Entry<com.you.lld.problems.coffeemachine.model.Ingredient, Integer> e : ingredients.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue());
        }

        // Order espresso
        System.out.println("\n--- Order Espresso ---");
        Order order1 = machine.placeOrder(BeverageType.ESPRESSO);
        System.out.println("Order: " + order1);

        Payment pay1 = new Payment("PAY-1", order1.getId(), 
            BigDecimal.valueOf(3), PaymentMethod.CARD);
        boolean paid = machine.processPayment(order1.getId(), pay1);
        System.out.println("Payment: " + (paid ? "success" : "failed"));
        System.out.println("Order status: " + order1.getStatus());

        // Order cappuccino
        System.out.println("\n--- Order Cappuccino ---");
        Order order2 = machine.placeOrder(BeverageType.CAPPUCCINO);
        Payment pay2 = new Payment("PAY-2", order2.getId(), 
            BigDecimal.valueOf(4), PaymentMethod.CASH);
        machine.processPayment(order2.getId(), pay2);
        System.out.println("Cappuccino: " + order2.getStatus());

        // Refill ingredients
        System.out.println("\n--- Refill ---");
        machine.refillIngredient(com.you.lld.problems.coffeemachine.model.Ingredient.COFFEE, 100);
        machine.refillIngredient(com.you.lld.problems.coffeemachine.model.Ingredient.MILK, 200);
        System.out.println("Refilled coffee and milk");

        // Check updated ingredients
        ingredients = machine.checkIngredients();
        System.out.println("After refill:");
        for (Map.Entry<com.you.lld.problems.coffeemachine.model.Ingredient, Integer> e : ingredients.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
