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

        // 2. Select -> pay -> dispense, in that order
        System.out.println("\n--- 2. Select, then pay, then dispense ---");
        System.out.println("  state: " + machine.getStateName());
        Order order = machine.placeOrder(BeverageType.ESPRESSO);
        System.out.println("  after selecting: state=" + machine.getStateName()
                + ", order=" + order.getStatus()
                + ", coffee still " + machine.checkIngredients().get(Ingredient.COFFEE)
                + " (nothing consumed yet)");
        boolean paid = machine.processPayment(order.getId(),
                new Payment("P1", order.getId(), new BigDecimal("3.00"), PaymentMethod.CARD));
        System.out.println("  paid 3.00 for a 2.50 espresso -> " + paid
                + ", order=" + order.getStatus()
                + ", change=" + order.getChangeDue());
        System.out.println("  coffee now " + machine.checkIngredients().get(Ingredient.COFFEE)
                + ", state=" + machine.getStateName());

        // 3. Underpaying gets no drink and the money back
        System.out.println("\n--- 3. Underpayment: no drink, full refund ---");
        int milkBefore = machine.checkIngredients().get(Ingredient.MILK);
        Order shortPaid = machine.placeOrder(BeverageType.LATTE);
        boolean ok = machine.processPayment(shortPaid.getId(),
                new Payment("P2", shortPaid.getId(), new BigDecimal("1.00"), PaymentMethod.CASH));
        System.out.println("  paid 1.00 for a 3.50 latte -> " + ok
                + ", order=" + shortPaid.getStatus()
                + ", refunded=" + shortPaid.getChangeDue() + ", kept=" + shortPaid.getAmountPaid());
        System.out.println("  milk " + milkBefore + " -> " + machine.checkIngredients().get(Ingredient.MILK)
                + " (untouched), state=" + machine.getStateName());

        // 4. The machine refuses a second order mid-transaction, and can be cancelled
        System.out.println("\n--- 4. State guards ---");
        Order pending = machine.placeOrder(BeverageType.CAPPUCCINO);
        System.out.println("  state: " + machine.getStateName());
        try {
            machine.placeOrder(BeverageType.LATTE);
        } catch (IllegalStateException e) {
            System.out.println("  second order refused: " + e.getMessage());
        }
        machine.cancelOrder();
        System.out.println("  after cancel: state=" + machine.getStateName()
                + ", order=" + pending.getStatus());

        // 5. Out of stock is caught at selection, before taking money
        System.out.println("\n--- 5. Out of ingredients ---");
        while (machine.checkIngredients().get(Ingredient.MILK) >= 100) {
            Order l = machine.placeOrder(BeverageType.LATTE);
            machine.processPayment(l.getId(),
                    new Payment("PX", l.getId(), new BigDecimal("3.50"), PaymentMethod.CARD));
        }
        System.out.println("  milk exhausted: " + machine.checkIngredients().get(Ingredient.MILK));
        try {
            machine.placeOrder(BeverageType.LATTE);
        } catch (IllegalStateException e) {
            System.out.println("  refused before any payment: " + e.getMessage());
        }
        machine.refillIngredient(Ingredient.MILK, 500);
        System.out.println("  after refill, milk=" + machine.checkIngredients().get(Ingredient.MILK)
                + ", state=" + machine.getStateName());

        System.out.println("\n=== Demo complete ===");
    }
}
