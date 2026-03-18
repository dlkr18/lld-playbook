package com.you.lld.problems.vendingmachine;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.*;

/**
 * Demo: Vending Machine with state pattern, money handling, dispensing, cancellation.
 */
public class VendingMachineDemo {

    public static void main(String[] args) {
        System.out.println("=== Vending Machine Demo ===\n");

        VendingMachineImpl machine = new VendingMachineImpl();

        // Stock the machine
        Product coke = new Product("P1", "Coca-Cola", Money.dollars(1.50), ProductCategory.BEVERAGES);
        Product chips = new Product("P2", "Lay's Chips", Money.dollars(1.25), ProductCategory.SNACKS);
        Product water = new Product("P3", "Spring Water", Money.dollars(1.00), ProductCategory.BEVERAGES);
        Product snickers = new Product("P4", "Snickers Bar", Money.dollars(1.75), ProductCategory.CANDY);

        machine.addSlot(new Slot("A1", coke, 5, 10));
        machine.addSlot(new Slot("A2", chips, 3, 10));
        machine.addSlot(new Slot("B1", water, 8, 10));
        machine.addSlot(new Slot("B2", snickers, 2, 10));

        System.out.println("Available products:");
        for (Slot slot : machine.getAvailableSlots()) {
            System.out.println("  " + slot);
        }

        // --- Scenario 1: Successful purchase ---
        System.out.println("\n--- Scenario 1: Buy Coca-Cola ($1.50) ---");
        System.out.println("State: " + machine.getCurrentState());
        machine.insertMoney(Money.DOLLAR);
        System.out.println("Inserted $1.00, balance: " + machine.getCurrentBalance());
        machine.insertMoney(Money.QUARTER);
        machine.insertMoney(Money.QUARTER);
        System.out.println("Inserted 2 quarters, balance: " + machine.getCurrentBalance());
        System.out.println("State: " + machine.getCurrentState());
        
        machine.selectProduct("A1");
        System.out.println("Selected: " + machine.getSelectedProduct().getName());
        System.out.println("State: " + machine.getCurrentState());
        
        Product dispensed = machine.dispense();
        System.out.println("Dispensed: " + dispensed.getName());
        System.out.println("State: " + machine.getCurrentState());

        // --- Scenario 2: Insufficient funds ---
        System.out.println("\n--- Scenario 2: Insufficient funds for Snickers ($1.75) ---");
        machine.insertMoney(Money.DOLLAR);
        System.out.println("Inserted $1.00, balance: " + machine.getCurrentBalance());
        try {
            machine.selectProduct("B2");
        } catch (IllegalStateException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // --- Scenario 3: Cancel transaction ---
        System.out.println("\n--- Scenario 3: Cancel and refund ---");
        System.out.println("Balance before cancel: " + machine.getCurrentBalance());
        Money refund = machine.cancelTransaction();
        System.out.println("Refund: " + refund);
        System.out.println("State: " + machine.getCurrentState());

        // --- Scenario 4: Empty slot ---
        System.out.println("\n--- Scenario 4: Buy until empty ---");
        // Snickers has qty=2
        for (int i = 1; i <= 3; i++) {
            try {
                machine.insertMoney(Money.DOLLAR);
                machine.insertMoney(Money.DOLLAR);
                machine.selectProduct("B2");
                Product p = machine.dispense();
                System.out.println("  Purchase " + i + ": " + p.getName());
            } catch (IllegalStateException e) {
                System.out.println("  Purchase " + i + " failed: " + e.getMessage());
                machine.cancelTransaction(); // refund
            }
        }
        System.out.println("Slot B2 available? " + machine.isProductAvailable("B2"));

        // --- Scenario 5: Concurrent thread safety demo ---
        System.out.println("\n--- Scenario 5: Concurrent purchases (thread safety) ---");
        // Restock water
        machine.getSlot("B1").refill(water, 5);
        
        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                try {
                    machine.insertMoney(Money.DOLLAR);
                    machine.selectProduct("B1");
                    Product p = machine.dispense();
                    System.out.println("  Thread-" + idx + " got: " + p.getName());
                } catch (Exception e) {
                    System.out.println("  Thread-" + idx + " failed: " + e.getMessage());
                    try { machine.cancelTransaction(); } catch (Exception ignored) {}
                }
            });
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            try { t.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("Water remaining: " + machine.getSlot("B1").getQuantity());

        System.out.println("\n=== Demo complete ===");
    }
}
