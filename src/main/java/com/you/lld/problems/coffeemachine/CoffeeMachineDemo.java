package com.you.lld.problems.coffeemachine;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Ingredient;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.model.PaymentMethod;

import java.math.BigDecimal;

/**
 * SDE3 demo: State pattern, menu, payment, ingredient depletion + refill.
 */
public class CoffeeMachineDemo {

    public static void main(String[] args) {
        System.out.println("=== Coffee Machine (SDE3) ===\n");
        CoffeeMachine machine = new CoffeeMachine();

        // 1. Menu
        System.out.println("--- 1. Menu ---");
        for (com.you.lld.problems.coffeemachine.model.Beverage b : machine.getMenu()) {
            System.out.println("  " + b.getName() + " $" + b.getPrice());
        }

        // 2. Successful order + payment
        System.out.println("\n--- 2. Order + payment ---");
        System.out.println("State: " + machine.getStateName());
        Order order = machine.placeOrder(BeverageType.ESPRESSO);
        boolean paid = machine.processPayment(order.getId(),
                new Payment("P1", order.getId(), new BigDecimal("3.00"), PaymentMethod.CARD));
        System.out.println("Order: " + order.getStatus() + ", paid=" + paid);

        // 3. Ingredient tracking
        System.out.println("\n--- 3. Ingredients ---");
        System.out.println("Coffee left: " + machine.checkIngredients().get(Ingredient.COFFEE));

        // 4. Refill
        System.out.println("\n--- 4. Refill ---");
        machine.refillIngredient(Ingredient.MILK, 500);
        Order latte = machine.placeOrder(BeverageType.LATTE);
        System.out.println("Latte: " + latte.getStatus());

        // 5. State guard — machine returns to IDLE after brew
        System.out.println("\n--- 5. State pattern ---");
        System.out.println("After brew, state=" + machine.getStateName() + " (ready for next order)");

        System.out.println("\n=== Demo complete ===");
    }
}
